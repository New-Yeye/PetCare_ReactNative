import React, { useEffect, useState, useRef } from 'react';
import {
    TouchableOpacity,
    View,
    StyleSheet,
    Button,
    Text,
    TextInput,
    SafeAreaView,
    Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { publish, connect } from './utils';
import { Separator } from './HomeScreen';

export const FeedScreen = ({ navigation }) => {
    const [feedMax, setFeedMax] = useState('1000');
    const [feedValue, setFeedValue] = useState('');
    const [tMax, setTMax] = useState('50');
    const [hMax, setHMax] = useState('100');

    const webviewRef = useRef(null);

    useEffect(() => {
        const client = connect();
        publish('Pet/Phone/Feed', '""');
        publish('Pet/Phone/Env', '""');

        const timer = setInterval(() => {
            publish('Pet/Phone/Feed', '""');
            publish('Pet/Phone/Env', '""');
        }, 10000);

        const messageListener = (topic, payload) => {
            if (topic === 'Pet/Server/Feed') {
                setFeedValue(JSON.parse(payload.toString()).feedValue);
            } else if (topic === 'Pet/Server/Env') {
                let axisData = new Date().toLocaleTimeString().replace(/^\D*/, '');
                console.log('env')
                let {t,h}=JSON.parse(payload.toString())
                console.log([t,h])
                // Update the chart in WebView
                webviewRef.current.postMessage(
                    JSON.stringify({
                        t,
                        h,
                        axisData,
                    })
                );
                console.log('post')
            }
        };

        client.on('message', messageListener);
        return () => {
            clearInterval(timer);
            client.off('message', messageListener);
        };
    }, []);

    const handlePress = (obj) => {
        let pubMsg = JSON.stringify(obj);
        publish('Pet/Phone/Feed', pubMsg,1);
    };

    const handlePress2 = (obj) => {
        let pubMsg = JSON.stringify(obj);
        publish('Pet/Phone/Env', pubMsg,1);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ height: 40 }}></View>
            <View style={{paddingHorizontal: 20,paddingVertical: 30}}>
                <View style={styles.border}>
                    <Text style={[styles.font, styles.label]}>投喂</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ paddingVertical: 10, marginRight: 10 }}>近期平均投喂量:</Text>
                        <TextInput
                            style={{ borderWidth: 1, borderRadius: 5, width: 60, height: 40 }}
                            value={isNaN(feedValue) ? '' : feedValue.toString()}
                            editable={false}
                        />
                    </View>
                    <View style={{ flexDirection: 'row' ,marginTop:10}}>
                        <Text style={{ paddingVertical: 10, marginRight: 10 }}>投喂阈值:</Text>
                        <TextInput
                            style={{ borderWidth: 1, borderRadius: 5, width: 60, height: 40 }}
                            placeholder="请输入"
                            value={isNaN(feedMax) ? '' : feedMax.toString()}
                            onChangeText={(text) => setFeedMax(parseFloat(text))}
                        />
                        <View style={{ justifyContent:'center', marginLeft: 'auto' }}>
                            <Button title="确定" onPress={() => handlePress({ max: feedMax })} />
                        </View>
                    </View>
                    <View style={{marginVertical:10}}>
                        <Button title="记录" onPress={() => handlePress({ save: true })} />
                    </View>
                </View>
                
                <View style={styles.border}>
                    <Text style={[styles.font, styles.label]}>温湿度</Text>
                    <View style={{ flexDirection: 'row' }}>

                        <Text style={{ paddingVertical: 10, marginRight: 10 }}>温度阈值:</Text>
                        <TextInput
                            style={{ borderWidth: 1, borderRadius: 5, width: 60, height: 40 ,marginRight:10}}
                            placeholder="请输入"
                            value={isNaN(tMax) ? '' : tMax.toString()}
                            onChangeText={(text) => setTMax(parseFloat(text))}
                        />
            
                        <Text style={{ paddingVertical: 10, marginRight: 10 }}>湿度阈值:</Text>
                        <TextInput
                            style={{ borderWidth: 1, borderRadius: 5, width: 60, height: 40 }}
                            placeholder="请输入"
                            value={isNaN(hMax) ? '' : hMax.toString()}
                            onChangeText={(text) => setHMax(parseFloat(text))}
                        />
                    </View>
                    <View style={{marginVertical:10}}>
                        <Button title="确定" onPress={() => handlePress2({ tMax:tMax,hMax: hMax })} />
                    </View>
                    <View style={[styles.border,{width:'100%',height:250,borderColor:'lightgray',padding:0,paddingHorizontal:0}]}>
                    <WebView
                        ref={webviewRef}
                        originWhitelist={['*']}
                        javaScriptEnabled={true}
                        source={{
                            html: `
                <!DOCTYPE html>
                <html lang="zh">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Feed Chart</title>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/5.4.2/echarts.min.js"></script>
                </head>
                <body>
                    <div id="chart" style="width: 100%; height: 230px;"></div>
                    <script>
                        const chart = echarts.init(document.getElementById('chart'));
                        const categories =[] 
                        const tData = []
                        const hData = []
                        const option = {
                            legend: {},
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'cross',
                                    label: {
                                        backgroundColor: '#283b56'
                                    }
                                }
                            },
                            xAxis: [
                                {
                                    type: 'category',
                                    boundaryGap: true,
                                    data: categories
                                },
                            ],
                            yAxis: [
                                { type: 'value',name: '温度' ,max:50,min:0,boundaryGap: [0.2, 0.2],scale: true,splitLine:{show:false},},
                                { type: 'value', name: '湿度' ,max:100,min:0,boundaryGap: [0.2, 0.2],scale: true,splitLine:{show:false},},
                            ],
                            series: [
                                {
                                    name: '温度',
                                    type: 'bar',
                                    data: tData,
                                    yAxisIndex: 0
                                },
                                {
                                    name: '湿度',
                                    type: 'line',
                                    data: hData,
                                    yAxisIndex: 1
                                },
                            ],
                        };
                        chart.setOption(option);
                        document.addEventListener('message', function (event) {
                            let {t,h,axisData}=JSON.parse(event.data)
                            categories.push(axisData)
                            tData.push(t)
                            hData.push(h)
                            if(categories.length>=6){
                                categories.shift()
                                tData.shift()
                                hData.shift()
                            }
                            chart.setOption({
                                xAxis: [
                                    {
                                        data: categories
                                    },
                                ],
                                series: [
                                    {
                                        data: tData
                                    },
                                    {
                                        data: hData
                                    }
                                ]
                            });
                        });

                    </script>
                </body>
                </html>
                `,
                        }}
                        onMessage={(event) => console.log('Message from WebView:', event.nativeEvent.data)}
                    />
                </View>
                
                </View>
                
                {/* WebView for chart */}
                
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'aliceblue',
    },
    label: {
        marginTop: 10,
        marginBottom: 10,
        alignSelf: 'flex-start'
    },
    font: {
        fontSize: 20,
        fontWeight: 900,
    },
    border: {
        borderWidth:2,padding:5,borderRadius:5,paddingHorizontal:10,marginBottom:20
    }
});

export default FeedScreen;
