---
title: kafka初体验
author: Jason Lee
date: 2023-09-20 09:06:00
tags: kafka
categories:
---

## 启动 zookeeper 和 kafka

安装参考[教程](https://www.geeksforgeeks.org/how-to-install-and-run-apache-kafka-on-windows/)。本机版本是 2.12-3.5.1。

在启动 kafka 之前先启动 zookeeper：

```
.\bin\windows\zookeeper-server-start.bat .\config\zookeeper.properties
```

然后

```
.\bin\windows\kafka-server-start.bat .\config\server.properties
```

## 创建 topic

```
.\bin\windows\kafka-topics.bat --create --bootstrap-server localhost:9092 --topic my-topic --partitions 3 --replication-factor 1
```

解释一下参数的含义：

- kafka-topics.bat：用于创建、列出或删除 Kafka 主题的命令。
- create：指示要创建主题。
- bootstrap-server localhost:9092：指定 Kafka 服务器的地址和端口。确保这个地址和端口与你的 Kafka 服务器配置一致。
- topic my-topic：指定要创建的主题名称，你可以将 my-topic 替换为你想要的主题名称。
- partitions 3：指定主题的分区数。你可以根据需要调整分区数。
- replication-factor 1：指定主题的复制因子。在本例中，复制因子为 1，这意味着每个分区只有一个副本。

列出 kafka 所有 topics，查看是否创建成功：

```
.\bin\windows\kafka-topics.bat --list --bootstrap-server localhost:9092
```

## 生产者发送消息

```
.\bin\windows\kafka-console-producer.bat --bootstrap-server localhost:9092 --topic my-topic
```

- kafka-console-producer.bat：这是 Kafka 的命令行生产者工具。
- bootstrap-server localhost:9092：指定 Kafka 服务器的地址和端口。确保这个地址和端口与你的 Kafka 服务器配置一致。
- topic your-topic-name：指定你要发送消息的主题名称，请将 your-topic-name 替换为你的实际主题名称。

运行上述命令后，命令行将进入消息输入模式。你可以在命令行中输入消息，然后按 Enter 键发送它们。当你完成发送消息后，你可以通过键入 Ctrl+C 来退出 Kafka 生产者。

## 消费者接受消息

```
.\bin\windows\kafka-console-consumer.bat --bootstrap-server localhost:9092 --topic my-topic --from-beginning
```

- kafka-console-consumer.bat：这是 Kafka 的命令行消费者工具。
- bootstrap-server localhost:9092：指定 Kafka 服务器的地址和端口。确保这个地址和端口与你的 Kafka 服务器配置一致。
- topic your-topic-name：指定你要消费消息的主题名称，请将 your-topic-name 替换为你的实际主题名称。
- from-beginning：这个选项表示你要从主题的起始位置开始消费消息。如果你希望从当前的消息位置开始消费，可以省略这个选项。

运行上述命令后，Kafka 消费者将开始消费指定主题中的消息。如果你之前已经在生产者中发送了消息到该主题，那么这些消息将会显示在命令行中。

你可以在命令行中看到消费的消息，直到你手动停止消费者（通过按 Ctrl+C）或者关闭命令行窗口。
