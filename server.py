import json
import logging
import os

from dotenv import load_dotenv  # type: ignore
from telethon import TelegramClient, events  # type: ignore
from telethon.errors.rpcerrorlist import MessageIdInvalidError  # type: ignore

load_dotenv()

# Các thông tin cần thiết cho việc kết nối với Telegram
api_id = os.getenv('TELE_API_ID')
api_hash = os.getenv('TELE_API_HASH')
session_name = 'copy_trade_session' 
GROUP_A_ID = os.getenv('GROUP_A_ID')

# ID của nhóm B (nhóm đích)
GROUP_B_ID = os.getenv('GROUP_B_ID')

print("GROUP_A_ID:::", GROUP_A_ID)
print("GROUP_B_ID:::", GROUP_B_ID)

messages_dict = {} 


try:
    with open("message_ids.json", "r") as f:
        try:
            messages_dict = json.load(f)
        except json.JSONDecodeError as e:
            logging.error(e)  # Ghi log lỗi mặc định của JSONDecodeError
            messages_dict = {}
except FileNotFoundError as e:
    logging.error(e)
    logging.warning("File 'message_ids.json' not found, starting with an empty dictionary.")


print(messages_dict)

with TelegramClient(session_name, api_id, api_hash) as client:
    @client.on(events.NewMessage(chats=GROUP_A_ID))
    async def handle_message(event):

        if event.message.reply_to_msg_id is not None:
            print("event.message.reply_to_msg_id:::", event.message.reply_to_msg_id)
            try:
                message_id_to_reply_to = messages_dict[f"'{event.message.reply_to_msg_id}'"]
                original_message = await client.get_messages(GROUP_B_ID, ids=message_id_to_reply_to)

                if original_message:
                    reply_message = await original_message.reply(event.message.text)
                    messages_dict[f"'{event.message.id}'"] = reply_message.id
                else:
                    print("Original message not found in groupB.")

            except KeyError:  
                sent_message = await client.send_message(GROUP_B_ID, event.message.text)
                messages_dict[f"'{event.message.id}'"] = sent_message.id  
            except MessageIdInvalidError:  # type: ignore
                print("Invalid message ID.")
        else:
            sent_message = await client.send_message(GROUP_B_ID, event.message.text)
            messages_dict[f"'{event.message.id}'"] = sent_message.id  

    print("Listening for messages from groupA...")
    client.run_until_disconnected()
    
    with open("message_ids.json", "w") as f:
        json.dump(messages_dict, f)
    print("Message IDs saved to file.")