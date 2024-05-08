import {ProCard} from "@ant-design/pro-components";
import style from "./index.less";
import {Avatar, Button, Card, Divider, Flex, Input, Tooltip} from "antd";
import {SendOutlined} from "@ant-design/icons";
import {useEffect, useRef, useState} from "react";
import {request} from "umi";
import { Remarkable } from "remarkable"

export default function Chat() {
    const refOutput: any = useRef()
    const refInput: any = useRef()
    const [messages, setMessages] = useState<any>([
        {
            "role": "assistant",
            "message": "你好！ 我是你的助理，有什么可以帮到你的吗？"
        },
    ])
    const [input, setInput] = useState("");
    const queryHandler = (e: any) => {
        e.stopPropagation()
        const inputText = input.trim();
        if (inputText) {
            const userMessage = {
                "role": "user",
                "message": inputText
            }
            const aiMessage: any = {
                "role": "assistant",
                "loading": true,
                "message": ""
            }
            const result = messages
            request("/api/v1/ask", {
                method: "POST",
                data: {
                    input: inputText
                }
            }).then(res => {
                if (!res.data) return;
                const {answer, context} = res.data
                const md = new Remarkable()
                aiMessage.loading = false
                aiMessage.message = <div dangerouslySetInnerHTML={{__html: md.render(res.data.answer)}}/>
                aiMessage.context = context
                setMessages([...result])
            }).catch(err => {
                aiMessage.loading = false
                aiMessage.message = "抱歉，我不知道你在说什么"
                setMessages([...result])
            })
            result.push(userMessage)
            setMessages([...result])
            setTimeout(() => {
                result.push(aiMessage)
                setMessages([...result])
            })
        }
        setTimeout(() => {
            setInput("")
            refInput.current?.focus()
        })
    }
    useEffect(() => {
        refOutput.current?.scroll({
            top: refOutput.current.scrollHeight,
            behavior: "smooth"
        })
    }, [messages]);
    return (
        <ProCard split="vertical" style={{height: "100%"}}>
            <ProCard colSpan="200px">助理</ProCard>
            <ProCard direction="column" style={{height: "100%"}}>
                <div className={style.chat}>
                    <div
                        className={style.chatOutput}
                        ref={refOutput}>
                        {messages.map(({role, message, loading, context}: any, index: number) => (
                            <Flex
                                gap={20}
                                justify={role === "assistant" ? "start" : "end"}
                                style={{marginBottom: "1rem"}}
                                key={index}>
                                {role === "assistant" &&
                                    <Avatar
                                        size={50}
                                        style={{backgroundColor: "#7265e6", flex: "none"}}>
                                        助手</Avatar>
                                }
                                <Card
                                    size="small"
                                    style={{backgroundColor: role === "user" ? "#e6f4ff" : "", minWidth: "60%"}}
                                    loading={loading}>
                                    {message}
                                    {
                                        context?.length &&
                                        <>
                                            <Divider className={style.divider} orientation="left" plain>
                                                找到{context.length}篇资料作为参考
                                            </Divider>
                                            <ol className={style.contents}>
                                                {context.map((item: any, index: number) => (
                                                    <li key={index}>
                                                        <div className={style.item}>
                                                            <Tooltip className={style.itemPage} title={item.page_content}>{item.page_content}</Tooltip>
                                                            <div className={style.itemFile}>({item.metadata.source})</div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ol>
                                        </>
                                    }
                                </Card>
                                {role === "user" && <Avatar size={50} style={{backgroundColor: "#f56a00", flex: "none"}}>用户</Avatar>}
                            </Flex>
                        ))}
                    </div>
                    <div className={style.chatInput}>
                        <Input.TextArea
                            ref={refInput}
                            value={input}
                            style={{height: "100%"}}
                            size="large"
                            classNames={{
                                textarea: style.chatInputInner
                            }}
                            onChange={e => setInput(e.target.value)}
                            onPressEnter={queryHandler}/>
                        <Button
                            className={style.chatSend}
                            icon={<SendOutlined/>}
                            shape="circle"
                            type="primary"
                            onClick={queryHandler}/>
                    </div>
                </div>
            </ProCard>
            <ProCard colSpan="200px">会话历史</ProCard>
        </ProCard>
    );
}