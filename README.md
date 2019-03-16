# Parallel_Backend

## Socket.io

### getAllChat
Server emit "getAllChat" when the client initial the connection
return array of Chats
#### Object description
```
{
    "username": string,
    "message": string,
}
```

### addNewChat
Server receive "addNewChat" from Client and emit it to all clients with "addNewChat"
emit Chat

| Body | Type | Value |
|:---:|:---:|:---:|
| username | string | username (max 20 characters) |
| message | string | message of the chat (max 140 characters) |

#### Object description
```
{
    "username": string,
    "message": string,
}
```
