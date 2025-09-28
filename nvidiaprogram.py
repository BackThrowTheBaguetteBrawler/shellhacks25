import tensorflow as tf
#print(tf.config.list_physical_devices('GPU'))
import torch
print(torch.cuda.is_available())
pip install -q openai
import openai
openai.my_api_key = 'sk-...0LYA'
import openai
openai.api_key = 'sk-...0LYA'
messages = [ {"role": "system", "content": 
              "You are a intelligent assistant."} ]
while True:
    message = input("User: ")
    if message:
        messages.append(
            {"role": "user", "content": message},
        )
        chat = openai.ChatCompletion.create(
            model="gpt-3.5-turbo", messages=messages
        )
    reply = chat.choices[0].message.content
    print(f"ChatGPT: {reply}")
    messages.append({"role": "assistant", "content": reply})
    
