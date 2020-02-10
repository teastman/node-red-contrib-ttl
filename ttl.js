/**
 * Copyright 2020 Tyler Eastman.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function (RED) {

    RED.nodes.registerType('ttl-set', function(config) {
        RED.nodes.createNode(this, config);

        const node = this;
        node.ttl = config.ttl;
        node.ttlType = config.ttlType;
        node.units = config.units;
        node.unitsType = config.unitsType;

        node.on('input', function (msg) {
            var ttl = RED.util.evaluateNodeProperty(node.ttl, node.ttlType, node, msg);
            var units = RED.util.evaluateNodeProperty(node.units, node.unitsType, node, msg);
            
            if(isNaN(ttl))
                node.error("TTL must be a number.", msg);

            switch(String(units).toLowerCase()) {
                case "milliseconds":
                    break;
                case "minutes":
                    ttl = ttl * 1000 * 60;
                    break;
                case "hours":
                    ttl = ttl * 1000 * 60 * 60;
                    break;
                default:
                    ttl = ttl * 1000;
            }

            msg._tod = Date.now() + Number(ttl);
            node.send(msg);
        });

        node.on('close', function (removed, done) {
            done();
        });
    });

    RED.nodes.registerType('ttl-check', function(config) {
        RED.nodes.createNode(this, config);

        const node = this;
        node.throwErrors = config.throwErrors;
        node.killNoTod = config.killNoTod;
        node.outputDeaths = config.outputDeaths;
        node.outputs = config.outputs;

        node.on('input', function (msg) {
            var dead = false;

            if(msg._tod === null || msg._tod === undefined) {
                if(node.killNoTod)
                    dead = true;
            }
            else if(Number(msg._tod) < Date.now())
                dead = true;
            

            if(!dead){
                node.send(msg);
            }
            else{
                if(node.outputDeaths){
                    node.send([null, msg]);
                }
                if(node.throwErrors){
                    node.error("TTL Message is dead.", msg);
                }
            }
        });

        node.on('close', function (removed, done) {
            done();
        });
    });
};
