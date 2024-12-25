import React, { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet ,Switch} from 'react-native';
import Collapsible from 'react-native-collapsible';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { publish } from "./utils";
import Slider from '@react-native-community/slider';
const Separator = () => {
    return (
        <View style={{ height: 1, backgroundColor: 'rgba(0, 0, 0, 0.25)' }} />
    );
};
const Alarm=()=>{
    const [isOpening,setOpening]=useState(true)

    return(
        <View>
            <Separator></Separator>
            <View style={styles.item}>
                <Text style={styles.marginRight}>{isOpening?'开启':'关闭'}</Text>
                <Switch value={isOpening} onValueChange={()=>{publish('Pet/Phone/Alarm',`{"open":${!isOpening}}`,1);setOpening(!isOpening)}}></Switch>
            </View>
        </View>
        
    )
}
const OLED=()=>{
    const [isOpening,setOpening]=useState(true)
    const [font,setFont]=useState(1)
    const [color,setColor]=useState(false)
    return(
        <View>
            <Separator></Separator>
            <View style={styles.item}>
                <Text style={styles.marginRight}>{isOpening?'开启':'关闭'}</Text>
                <Switch value={isOpening} onValueChange={()=>{publish('Pet/Phone/OLED',`{"open":${!isOpening}}`,1);setOpening(!isOpening)}}></Switch>
            </View>
            <Separator></Separator>
            <View style={styles.item}>
                <Text style={styles.marginRight}>{font==1?'字体1':'字体2'}</Text>
                <Switch value={font==1?false:true} onValueChange={()=>{publish('Pet/Phone/OLED',`{"font":${3-font}}`,1);setFont(3-font)}}></Switch>
            </View>
            <Separator></Separator>
            <View style={styles.item}>
                <Text style={styles.marginRight}>{!color?'颜色1':'颜色2'}</Text>
                <Switch value={color} onValueChange={()=>{publish('Pet/Phone/OLED',`{"color":${!color}}`,1);setColor(!color)}}></Switch>
            </View>
        </View>
    )
}
const LED=()=>{
    const [isOpening,setOpening]=useState(false)
    const [RGB,setRGB]=useState({r:0,g:0,b:0})
    return(
        <View >
            <Separator></Separator>
            <View style={styles.item}>
                <Text style={styles.marginRight}>{isOpening?'开启':'关闭'}</Text>
                <Switch value={isOpening} onValueChange={()=>{publish('Pet/Phone/LED',`{"open":${!isOpening}}`,1);setOpening(!isOpening)}}></Switch>
            </View>
            <Separator></Separator>
            <View style={styles.item}>
                <Text style={styles.marginRight}>R: {RGB.r}</Text>
                <Slider
                    style={styles.sliderWidth}
                    step={1}
                    minimumValue={0}
                    maximumValue={255}
                    value={RGB.r}
                    onSlidingComplete={
                        (value) => {
                            publish('Pet/Phone/LED',`{"r":${value},"g":${RGB.g},"b":${RGB.b}}`,1);
                            setRGB({r:value,g:RGB.g,b:RGB.b})
                        }
                    }
                />
            </View>
            
            <View style={styles.item}>
                <Text style={styles.marginRight}>G: {RGB.g}</Text>
                <Slider
                    style={styles.sliderWidth}
                    step={1}
                    minimumValue={0}
                    maximumValue={255}
                    value={RGB.g}
                    onSlidingComplete={
                        (value) => {
                            publish('Pet/Phone/LED',`{"r":${RGB.r},"g":${value},"b":${RGB.b}}`,1);
                            setRGB({r:RGB.r,g:value,b:RGB.b})
                        }
                    }
                />
            </View>
            <View style={styles.item}>
                <Text style={styles.marginRight}>B: {RGB.b}</Text>
                <Slider
                    style={styles.sliderWidth}
                    step={1}
                    minimumValue={0}
                    maximumValue={255}
                    value={RGB.b}
                    onSlidingComplete={
                        (value) => {
                            publish('Pet/Phone/LED',`{"r":${RGB.r},"g":${RGB.g},"b":${value}}`,1);
                            setRGB({r:RGB.r,g:RGB.g,b:value})
                        }
                    }
                />
            </View>
            
        </View>
    )
}
const Fan=()=>{  
    const [isOpening,setOpening]=useState(false)
    const [sliderValue, setSliderValue] = useState(0)
    return(
        <View>
            <Separator></Separator>
            <View style={styles.item}>
                <Text style={styles.marginRight}>{isOpening?'开启':'关闭'}</Text>
                <Switch value={isOpening} onValueChange={()=>{publish('Pet/Phone/Fan',`{"open":${!isOpening}}`,1);setOpening(!isOpening)}}></Switch>
            </View>
            <Separator></Separator>
            <View style={styles.item}>
                <Text style={styles.marginRight}>风力: {sliderValue}</Text>
                <Slider
                    style={styles.sliderWidth}
                    step={1}
                    minimumValue={0}
                    maximumValue={255}
                    value={sliderValue}
                    onSlidingComplete={
                        (value) => {
                            publish('Pet/Phone/Fan',`{"state":${value}}`,1);
                            setSliderValue(value)
                        }
                    }
                />
            </View>
            
        </View>
    )
}
const Buzzer=()=>{
    const [isOpening,setOpening]=useState(false)
    return(
        <View>
            <Separator></Separator>
            <View style={styles.item}>
                <Text style={styles.marginRight}>{isOpening?'开启':'关闭'}</Text>
                <Switch value={isOpening} onValueChange={()=>{publish('Pet/Phone/Buzzer',`{"open":${!isOpening}}`,1)   ;setOpening(!isOpening)}}></Switch>
            </View>
        </View>
    )
}
export const DeviceScreen = () => {
    const [uncollapsedKey, setUncollapsedKey] = useState(null)
    const items = [
        {
            key: '1',
            title: '报警',
            content:  <Alarm></Alarm>
        },
        {
            key: '2',
            title: 'OLED屏',
            content:  <OLED></OLED>
        },
        {
            key:'3',
            title:'LED灯',
            content:<LED></LED>
        },
        {
            key:'4',
            title:'风扇',
            content:<Fan></Fan>
        },
        {
            key:'5',
            title:'蜂鸣器',
            content:<Buzzer></Buzzer>
        }
    ]
    const toggleCollapse = (key) => {
        setUncollapsedKey((prevKey) => (prevKey === key ? null : key));
    };
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={{ height: 40 }}></View>
                <View style={{ borderRadius: 10,padding:10,backgroundColor:'rgba(200, 240, 255, 1)',flexDirection:'row'}}>
                    <Ionicons style={{marginRight:'auto'}} name={'logo-react'} size={56} color={'rgba(150, 200, 255, 1)'} />
                    <View style={{justifyContent:'center'}}>
                        <Text>型号 :   ESP8266</Text>
                        <Text>电量 :   --</Text>
                    </View>
                </View>
                <View style={{height:40}}></View>
                <View style={{borderRadius: 10,backgroundColor:'rgba(190, 240, 230, 0.5)'}}>
                    {items.map((item) => (
                        <View key={item.key} style={styles.itemContainer}>
                            <TouchableOpacity style={[styles.height,styles.paddingHorizontal,{flexDirection:'row',alignItems:'center',}]} onPress={() => toggleCollapse(item.key)}>
                                <Text style={{textAlign:'center'}}>{item.title}</Text>
                                {uncollapsedKey !== item.key?<Ionicons style={{marginLeft:'auto'}} name="chevron-down-outline" size={15} color='gray'></Ionicons>
                                :<Ionicons style={{marginLeft:'auto'}} name="chevron-up-outline" size={15} color='gray'></Ionicons>}
                            </TouchableOpacity>
                            <Collapsible collapsed={uncollapsedKey !== item.key} duration={200}>
                                {item.content}
                                
                            </Collapsible>
                            
                        </View>
                    ))}
                </View>
            </ScrollView>
            
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'aliceblue',
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    itemContainer: {
        borderRadius:10,
        borderWidth:10,
        borderColor:'aliceblue'
    },
    height:{
        height:45
    },
    paddingHorizontal:{
        paddingHorizontal:15,
    },
    item:{flexDirection:'row',alignItems:'center',height:45,paddingHorizontal:15},
    marginRight:{
        marginRight:'auto'
    },
    sliderWidth:{
        width:'70%'
    }
});