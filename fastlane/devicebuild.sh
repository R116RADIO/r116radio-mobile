#get local address
if ipconfig getifaddr en0; then ip=$(ipconfig getifaddr en0); else ip=$(ipconfig getifaddr en1); fi
#get line number of the jscodelocation
device_line=$(sed -n '/jsCodeLocation = \[NSURL URLWithString:/=' ./../ios/R116Radio/AppDelegate.m)
emulator_line=$((device_line + 1))
#update device line with local device ip uncommented out
chmod +x ../ios/R116Radio/AppDelegate.m
sed -i "" "$device_line s/.*/  jsCodeLocation = \[NSURL URLWithString:@\"http:\/\/$ip:8081\/index\.ios\.bundle\?platform=ios\&dev=true\"\];/" ./../ios/R116Radio/AppDelegate.m
#check if emulator line is commented out, if not insert comments
if head -$emulator_line ../ios/R116Radio/AppDelegate.m | tail -1 | grep '//'; then echo No Changes Needed; else sed -i "" "$emulator_line s/^/\/\//" ./../ios/R116Radio/AppDelegate.m; fi
