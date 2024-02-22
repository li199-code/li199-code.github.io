---
title: linux上kafka安装和入门
date: 2024-02-21 10:47:00
tags:
  - kafka
  - 消息队列
categories:
---

## 安装

之前在 windows 上安装 kafka 算是吃尽苦头。现在用 linux 机器再试一次。像 kafka 这种依赖 zookeeper 的服务，最简单的方法还得是 docker。具体的教程就参考这篇文字：

---

使用 Docker 部署 Kafka 单机版
https://ken.io/note/kafka-standalone-docker-install

---

## kafkajs

公司项目的 kafka 是用 kafkajs 这个库来驱动的。但是，文档给出的例子没法直接运行，所以让 chatgpt 给出了一段能用的代码：

```javascript
const { Kafka } = require("kafkajs");

// 创建 Kafka 客户端实例
const kafka = new Kafka({
  clientId: "my-kafka-app",
  brokers: ["localhost:9092"], // 你的 Kafka 服务器地址
});

// 创建生产者实例
const producer = kafka.producer();

// 创建消费者实例
const consumer = kafka.consumer({ groupId: "test-group" });

// 发送消息函数
const sendMessage = async () => {
  await producer.connect();
  await producer.send({
    topic: "test-topic",
    messages: [{ value: "Hello KafkaJS!" }],
  });
  await producer.disconnect();
};

// 接收消息函数
const receiveMessage = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic,
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
    },
  });
};

// 发送和接收消息
sendMessage()
  .then(() => receiveMessage())
  .catch(console.error);
```

![17085683262981708568325402.png](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/17085683262981708568325402.png)

在输出消息之前，控制台还打印出了几条日志。目前主要关注最后两条。消费者启动并加入到消费者组。为了确定 kafka 的主题中是否真的有这个消息，运行：

```bash
kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test-topic --from-beginning
```
