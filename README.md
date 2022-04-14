# Things to Know
- npm init --yes
- npm install express --save
- You must refresh homepage after authentication login for role filtering to take effect
- I added an Admin role that can Edit/Delete/Add articles for all authors.
- YOUTUBE DEMO: https://youtu.be/ZTfIc59gTk8
- I included the postman workspace for activity1 in "lab4_aazacco/activity1/postmanWorkspace/SER421Lab4.postman_collection.json"

## How to run each activity:
- For Activity 1 copy: npm run act1 
- For Activity 2 copy: npm run act2 
- For Activity 3 copy: npm run act3

- Then paste and run in Terminal opened in root project directory

### Unaccomplishments
- I did not track the operations of each user in a logger file I just made console log print statements describing what the user is doing.
- Subscriber and Guests have same functionality, but i do meet the display functionality requirement for each. (Guests have a switch login where subscriber has "Welcome ${name}", all roles have hyperlink to authentication page for easy account switching.)
