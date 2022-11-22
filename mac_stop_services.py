#!/Library/Frameworks/Python.framework/Versions/3.8/bin/python3

import subprocess
import re
import os
import time

print("Stopping services")

# We kill applications that are listening to these ports
ports = [4215, 8215]


def get_bash_pids():
    lines = subprocess.run(
        ["ps"], check=True, stdout=subprocess.PIPE, universal_newlines=True
    ).stdout.split("\n")
    ttys = {}
    for i in lines:
        if not "ttys" in i:
            continue
        parts = i.split(" ")
        pid = parts[0]
        tty = parts[1]
        if not tty in ttys:
            ttys[tty] = []
        ttys[tty].append(pid)
    pids = {}
    for i in ttys.values():
        for pid in i:
            pids[pid] = len(i)
    # return dict [pid] -> count of ttys
    return pids


# Solve all terminal lines
old_pids = get_bash_pids()
for port in ports:
    try:
        data = subprocess.run(
            ["lsof", "-i", f"tcp:{port}"],
            check=True,
            stdout=subprocess.PIPE,
            universal_newlines=True,
        )
    except:
        print(f"Port {port} not in use")
        continue

    lines = data.stdout.split("\n")

    for line in lines:
        if "(LISTEN)" in line:
            print(line)
            temp = line.split(" ")
            for i in temp:
                if re.match("^[0-9]{1,}$", i):
                    pid = i
                    break
            print(f"Killing {pid}: {line}")
            os.kill(int(pid), 9)

# Need to wait a little, because killing takes some time
print("Waiting 2 s")
time.sleep(2)
new_pids = get_bash_pids()

for i in new_pids:
    # stop those that have less ttys
    if not i in old_pids or old_pids[i] > new_pids[i]:
        try:
            os.kill(int(i), 6)
            print(f"Killed {i}")
        except:
            print(f"There is no more process {i}")

print("All services stopped")
