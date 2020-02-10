node-red-contrib-ttl
========================
A Node-RED node for adding time to live (TTL) to messages and a second node for filtering messages which have timed out.

Install
-------
Run the following command in the root directory of your Node-RED install

    npm install node-red-contrib-ttl

Usage
-------

`ttl set` node will add a time of death `_tod` parameter to any message that passes through it.  The `_tod` parameter is a timestamp that is equal to the time the message arrived at the node plus the amount of time set in the TTL property of the node.

`ttl check` node will compare the `_tod` parameter of a message with the current time.  If the current time is past the `_tod` the message will be considered dead and not be propegated.

