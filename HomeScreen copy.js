import { connect, disconnect, publish, subscribe, unsubscribe } from "./utils.js";
import React, { useEffect, useRef, useState, } from "react";
import { ScrollView, SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";

export const HomeScreen = ({navigation}) => {
    const [isConnected, setConnected] = useState(false)
    const [recvMsg, setRecvMsg] = useState([
        ['主题', 'Qos', 'Payload', '时间'],
    ])
    const route = useRoute();
    let clientRef=useRef(null)

    useEffect(() => {
        navigation.setOptions(!isConnected?{tabBarStyle: { display: 'none' }}:{tabBarStyle: { display: 'flex' }});
        if (!isConnected) {
            if (route.name !== '主页') {
                navigation.navigate('主页'); // 跳转到主页
            }
            
        }
    }, [isConnected]);

    const handleConnect = () => {
        if(!clientRef.current){
            clientRef.current=connect()
            clientRef.current.on('connect', () => setConnected(true));
            clientRef.current.on('error', (err) => {
                // 弹窗
                console.log('Mqtt error:', err);
                setConnected(false)
            });
            clientRef.current.on('message', (topic, payload, packet) => {
                console.log('recv');

                setRecvMsg(prevRecvMsg => {
                    console.log(prevRecvMsg);
                    const newRecvMsgBody = [...prevRecvMsg.slice(1)];
                    
                    newRecvMsgBody.unshift([
                        topic, 
                        packet.qos, 
                        payload.toString(), 
                        new Date().toLocaleString()
                    ]);
            
                    if (newRecvMsgBody.length > 10) {
                        newRecvMsgBody.pop();
                    }
    
                    const newRecvMsg = [['主题', 'Qos', 'Payload', '时间'], ...newRecvMsgBody];
                    
                    console.log(newRecvMsg); 
                    return newRecvMsg;
                })
            })
        }else{
            clientRef.current=connect()
        }
        
        
    };


    const handleDisconnect = () => {
        disconnect()
        setConnected(false);
    };
    const [focusingIndex, setFocusingIndex] = useState(null)
    const [config, setConfig] = useState([
        { name: '主机名', value: '127.0.0.1' },
        { name: '端口', value: '8083' },
        { name: 'Path', value: '/mqtt' },
        { name: '客户端 ID', value: "emqx" + Math.random().toString(16).substring(2, 8) },
        { name: '用户名', value: '' },
        { name: '密码', value: '' },
        { name: 'KeepAlive', value: '60' },
    ]);

    const [pubTopic, setPubTopic] = useState('test/1')
    const [pubQos, setPubQos] = useState(0)
    const [payload, setPayload] = useState('{ "msg": "hello" }')

    const [subTopic, setSubTopic] = useState('test/#')
    const [subQos, setSubQos] = useState(0)

    const [subMsg, setSubMsg] = useState([
        ['主题', 'Qos', '时间', '取消'],
    ])
    const [pubMsg, setPubMsg] = useState([
        ['主题', 'Qos', 'Payload', '时间'],
    ])


    const handleConfigChange = (index, text) => {
        const newConfig = [...config];
        newConfig[index].value = text;
        setConfig(newConfig);
    };

    const handlePublish = () => {
        let success = publish(pubTopic, payload, pubQos)

        if (success) {
            const newPubMsgBody = [...pubMsg.slice(1)]
            newPubMsgBody.unshift([pubTopic, pubQos, payload, new Date().toLocaleString()])
            if (newPubMsgBody.length > 10) {
                newPubMsgBody.pop();
            }
            setPubMsg([['主题', 'Qos', 'Payload', '时间']].concat(newPubMsgBody))
        }
    }

    const handleSubscribe = () => {
        let success = subscribe(subTopic, subQos)

        if (success) {
            const newSubMsgBody = [...subMsg.slice(1)]
            newSubMsgBody.unshift([subTopic, subQos, new Date().toLocaleString(), '取消'])
            if (newSubMsgBody.length > 10) {
                newSubMsgBody.pop();
            }
            setSubMsg([['主题', 'Qos', '时间', '取消']].concat(newSubMsgBody))
        }
    }

    const handleUnsubscribe = (rowIndex) => {
        let success = unsubscribe(subMsg[rowIndex][0])

        if (success) {
            const newSubMsg = subMsg.filter((_, i) => i !== rowIndex)
            setSubMsg(newSubMsg)
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ height: 40 }}></View>
            <ScrollView style={{ paddingHorizontal: 20, paddingVertical: 30 }}>
                <View style={{borderWidth:1,borderColor:'lightgray',borderRadius:5}}>
                    <Text style={[styles.font, styles.label]}>连接配置</Text>

                    <View style={[
                        { alignContent: 'flex-start', },
                        styles.row
                    ]}>
                        {config.map((item, index) => (
                            <View key={index} style={{ width: '33.3%' }}>
                                <Text style={styles.label}>{item.name}</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        isConnected ? { backgroundColor: 'gray' } : { backgroundColor: 'black' },
                                        focusingIndex + 1 && focusingIndex === index ? { borderColor: 'lightgreen' } : null
                                    ]}
                                    value={item.value}
                                    onChangeText={(text) => handleConfigChange(index, text)}
                                    onFocus={() => {
                                        setFocusingIndex(index)
                                    }}
                                    onBlur={() => {
                                        setFocusingIndex(null)
                                    }}
                                    editable={!isConnected}
                                />
                            </View>
                        ))}
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: isConnected ? styles.buttonLight : styles.buttonDark }]}
                            onPress={handleDisconnect}
                            disabled={!isConnected}
                        >
                            <Text style={ styles.buttonText}>断开连接</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: !isConnected ? styles.buttonLight : styles.buttonDark }]}
                            onPress={handleConnect}
                            disabled={isConnected}
                        >
                            <Text style={styles.buttonText}>连接</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                <View >

                    <Text style={[styles.font, styles.label]}>订阅</Text>

                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '25%' }}>
                            <Text style={styles.label}>主题</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    isConnected ? { backgroundColor: 'black' } : { backgroundColor: 'gray' },
                                ]}
                                value={subTopic}
                                onChangeText={(text) => setSubTopic(text)}
                                editable={isConnected}
                            />
                        </View>
                        <View style={{ width: '25%' }}>
                            <Text style={styles.label}>Qos</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    isConnected ? { backgroundColor: 'black' } : { backgroundColor: 'gray' },
                                ]}
                                value={subQos.toString()}
                                onChangeText={(text) => setSubQos(parseInt(text))}
                                editable={isConnected}
                            />
                        </View>
                        <View style={{ width: '25%', justifyContent: 'flex-end' }}>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: isConnected ? 'lightgreen' : 'gray', marginBottom: 0 }]}
                                onPress={handleSubscribe}
                                disabled={!isConnected}
                            >
                                <Text style={{ color: isConnected ? 'gray' : 'lightgreen', textAlign: 'center' }}>订阅</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <List data={subMsg} colSpecialIndex={3} handle={handleUnsubscribe} Component={UnsubscribeButton} isConnected={isConnected}></List>
                </View>

                <View >

                    <Text style={[styles.font, styles.label]}>发布</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '25%' }}>
                            <Text style={styles.label}>主题</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    isConnected ? { backgroundColor: 'black' } : { backgroundColor: 'gray' },
                                ]}
                                value={pubTopic.toString()}
                                onChangeText={(text) => setPubTopic(text)}
                                editable={isConnected}
                            />
                        </View>
                        <View style={{ width: '25%' }}>
                            <Text style={styles.label}>Payload</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    isConnected ? { backgroundColor: 'black' } : { backgroundColor: 'gray' },
                                ]}
                                value={payload}
                                onChangeText={(text) => setPayload(text)}
                                editable={isConnected}
                            />
                        </View>
                        <View style={{ width: '25%' }}>
                            <Text style={styles.label}>Qos</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    isConnected ? { backgroundColor: 'black' } : { backgroundColor: 'gray' },
                                ]}
                                value={pubQos.toString()}
                                onChangeText={(text) => setPubQos(parseInt(text))}
                                editable={isConnected}
                            />
                        </View>
                        <View style={{ width: '25%', justifyContent: 'flex-end' }}>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: isConnected ? 'lightgreen' : 'gray', marginBottom: 0 }]}
                                onPress={handlePublish}
                                disabled={!isConnected}
                            >
                                <Text style={{ color: isConnected ? 'gray' : 'lightgreen', textAlign: 'center' }}>发布</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                        <View >
                            <Text style={styles.label}>已发送</Text>
                            <List data={pubMsg} colSpecialIndex={2} Component={MsgText}></List>
                        </View>
                        <View>
                            <Text style={styles.label}>已接收</Text>
                            <List data={recvMsg} colSpecialIndex={2} Component={MsgText}></List>
                        </View>
                    </View>
                    
                    
                </View>
                <View style={{ height: 30 }}></View>
            </ScrollView>
        </SafeAreaView>
    )
}

const List = ({ data, colSpecialIndex, handle, Component, isConnected }) => {
    return (
        <View style={{ borderRadius: 5, borderWidth: 1, borderColor: 'lightgray' }}>
            {data.map((rowItem, rowIndex) => {

                return (
                    <View key={rowIndex}>
                        <TouchableOpacity style={{ flexDirection: 'row', }} disabled={rowItem == 0 ? true : false}>
                            {rowItem.map((colItem, colIndex) => {
                                // specialcol
                                if (rowIndex > 0 && colSpecialIndex == colIndex) return (
                                    <Component key={colIndex} handle={handle} rowIndex={rowIndex} colItem={colItem} isConnected={isConnected}></Component>
                                )
                                return (
                                    <Text key={colIndex} style={[styles.label, { alignSelf: 'center', textAlign: 'center', width: '25%' }]}>
                                        {colItem}
                                    </Text>

                                )
                            })}
                        </TouchableOpacity>
                        <Separator></Separator>
                    </View>
                )
            })}
        </View>
    )
}
const UnsubscribeButton = ({ handle, rowIndex, isConnected }) => {
    return (
        <View
            style={[{ alignSelf: 'center', width: '25%', justifyContent: 'center', alignItems: 'center' }]}
        >
            <TouchableOpacity

                style={[styles.button, { margin: 0 }, { backgroundColor: isConnected ? 'orangered' : 'lightgray' }]}
                onPress={() => handle(rowIndex)}
                disabled={!isConnected}
            >
                <Text style={{ color: isConnected ? 'lightgray' : 'orangered', textAlign: 'center' }}>取消</Text>
            </TouchableOpacity>
        </View>
    )
}
const MsgText = ({ colItem }) => {
    return (
        <Text style={[styles.label, styles.MsgText]}>
            {colItem}
        </Text>
    )
}
export const Separator = () => {
    return (
        <View style={styles.Separator} />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",  // 深色背景
    },
    label: {
        marginTop: 10,
        marginBottom: 10,
        alignSelf: 'flex-start',
        color: 'white',  // 深色模式下的浅色文字
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    font: {
        fontSize: 20,
        fontWeight: 900,
        color: 'white',  // 浅色文字，适合深色背景
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',  // 深色模式下的灰色边框
        borderRadius: 5,
        paddingLeft: '10%',
        textAlign: 'left',
        backgroundColor: '#333333',  // 输入框背景为深灰色
        color: 'white',  // 输入框中文本的颜色为浅色
    },
    button: {
        borderRadius: 5,
        padding: 5,
        margin: 10,
        marginRight: 0,
    },
    // 深色主题下的按钮样式更新
    buttonText: {
        color: 'white',  // 按钮文本颜色为浅色
        textAlign: 'center',
    },
    buttonLight: {
        backgroundColor: '#6200ee',  // 活跃按钮的背景色
    },
    buttonDark: {
        backgroundColor: '#444',  // 非活跃或禁用按钮的背景色
    },
    border: {
        borderWidth: 1,
        borderColor: 'gray',
    },
    // 特殊组件
    MsgText: {
        color: 'orangered',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#333333',  // 消息文本背景色为深色
        alignSelf: 'center',
        textAlign: 'center',
        width: '25%',
    },
    Separator: {
        height: 1,
        backgroundColor: 'gray',  // 分隔线为浅灰色
    }
})
