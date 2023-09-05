import React, { useState } from "react";
import { client, xml } from "@xmpp/client";

function Form() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [connected, setConnected] = useState(false);
  const [connection, setConnection] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("user", username, password);
    // setServer(receiver.start())
    if (!connected) {
      try {
        const receiver = client({
          service: "wss://faeko.com/xmpp-websocket",
          domain: "faeko.com",
          //   username: "joswa",
          // password: "jos",
        });
        console.log(receiver);

        receiver.on("online", async (jid) => {
          setConnected(true);

          setConnection(receiver);
          await receiver.send(
            xml(
              "presence",
              xml("show", {}, "chat"),
              xml("status", {}, "Hi, test user!")
            ),
            receiver.emit("prsence", xml)
          );

          console.log(`connected  ${jid}`);
        });

        receiver.on("stanza", async (stanza) => {
          console.log("messgaw vanthruchi", stanza);
          if (stanza.is("message")) {
            await receiver.send(
              xml("presence", { type: "chat" }, xml("body", {}, "hello da!"))
            );

            await receiver.stop();
          }
        });
        console.log(receiver, "onion");
        await receiver.start();
      } catch (error) {
        console.log(error, "error");
      }
    }
  };

  return (
    <div>
      <div>
        <center>
          <h1>login</h1>
          <form onSubmit={handleSubmit}>
            <label for="uname">username:</label>
            <input
              type="text"
              value={username}
              id="uname"
              onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <label for="password">password:</label>
            <input
              type="text"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <input type="submit" value="save"></input>
          </form>
        </center>
      </div>
    </div>
  );
}

export default Form;
