from Crypto.Cipher import AES
from api.main import KEY
import base64

obj = AES.new(KEY, AES.MODE_CBC, "This is an IV456")
company = "Hopitech Oy"
until = "perpetually"
message = f"Licensed to {company} {until}.".ljust(64, " ")
print("This is the text")
print(message)
ciphertext = base64.b64encode(obj.encrypt(message)).decode("utf-8")
print(
    "This is the encrypted text. Add it to DYNDEV_LICENSE environment variable"
)
print(ciphertext)

print("This is decryption test")
b = bytes(base64.b64decode(ciphertext))

obj2 = AES.new(KEY, AES.MODE_CBC, "This is an IV456")

print(obj2.decrypt(b).decode("utf-8").strip())
