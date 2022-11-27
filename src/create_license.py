from Crypto.Cipher import AES
from api.main import KEY
import base64
import sys

if len(sys.argv) < 2:
    print("Give as first argument the company name")
    exit()

obj = AES.new(bytes(KEY, "utf-8"), AES.MODE_EAX)
company = sys.argv[1]
until = "perpetually"
message = f"Licensed to {company} {until}.".ljust(64, " ")
print("This is the text")
print(message)
response = obj.encrypt(bytes(message, "utf-8"))

ciphertext, tag = obj.encrypt_and_digest(bytes(message, "utf-8"))
ciphertext = base64.b64encode(ciphertext).decode("utf-8")
nonce = base64.b64encode(obj.nonce).decode("utf-8")
print(
    "This is the encrypted text. Add it to DYNDEV_LICENSE environment variable"
)
env_var = f"{ciphertext}#{nonce}"
print(env_var)

print("This is decryption test")
data = env_var.split("#")
ciphertext = data[0]
nonce = data[1]
b = bytes(base64.b64decode(ciphertext))
bn = bytes(base64.b64decode(nonce))

obj2 = AES.new(bytes(KEY, "utf-8"), AES.MODE_EAX, bn)
response = obj2.decrypt(b)
# print(response)

print(obj2.decrypt(b).decode("utf-8").strip())
