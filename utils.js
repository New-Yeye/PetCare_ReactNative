import mqtt from 'mqtt'

const url = 'ws://121.37.134.5:8083/mqtt'

const options = {
    clean:false,
    connectTimeout: 4000,
    clientId: "ws" + Math.random().toString(16).substring(2, 8),
    username: 'emqx_test',
    password: 'emqx_test',
    protocolVersion: 5,
}

let client = null

const connect = () => {
    if (!client) {
        client = mqtt.connect(url, options);
        subscribe('Pet/Server/#')
        console.log('connect')
    }else if(!client.connected){
        client.reconnect()
        console.log('reconnect')
    }
    return client
}

const disconnect = () => {
    client.end();
    console.log('disconnect')
}

const publish = async(pubTopic, pubMsg, pubQos=0) => {
    if(client.connected){
        await client.publish(pubTopic, pubMsg, { qos: pubQos }, (error) => {
            if (error) {
                console.error("Failed to publish message:", error);
                return false
            } else {
                console.log("Message published to topic:", pubTopic);
                return true
            }
        });
        console.log('pub')
    }
    return false
};

const subscribe = async(subTopic, subQos=0) => {
    
    await client.subscribe(subTopic, { qos: subQos }, (error) => {
        if (error) {
            console.error("Failed to subscribe to topic:", subTopic, error);
            return false
        } else {
            console.log("Subscribed to topic:", subTopic);
            return true
        }
    });
    console.log('sub')
};

const unsubscribe = async(subTopic) => {
    
    await client.unsubscribe(subTopic, {}, (error) => {
        if (error) {
            console.error("Failed to unsubscribe from topic:", subTopic, error);
            return false
        } else {
            console.log("Unsubscribed from topic:", subTopic);
            return true
        }
    });
    console.log('unsub')
};
export { connect, disconnect, publish, subscribe, unsubscribe }










