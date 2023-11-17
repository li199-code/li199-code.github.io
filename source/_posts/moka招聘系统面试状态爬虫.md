---
title: 招聘系统面试状态爬虫
date: 2022-11-03 21:26:48
tags: 爬虫
---

这几天学python爬虫，又买了腾讯云服务器，找个项目练练手。找到了一个需求：对招聘进度做一个定时爬取，如果有变化，微信通知我。任务可以分为两大块，一块是代码实现，一块是项目部署。

<!-- more -->
# a系统

## 代码实现

之前手头上有几个moka的api:

`https://app.mokahr.com/personal-center/editApplication/xxxxxx?orgId=zte`

后来觉得官网上的会更直观：

`https://app.mokahr.com/personal-center/applications?orgId=zte`

带上cookie，发起get请求，对返回的json数据肉眼解析，找到面试状态字段的位置。如果状态不是‘面试’，或者脚本请求不到数据，通知我。脚本可能会因为cookie过期失效。所以在外层套try/catch进行异常处理。最后，用一个免费的消息推送网站`http://wx.xtuis.cn/`提供的接口，将消息推送到手机。

```python
# -*- coding: UTF-8 -*- 
import requests
import json

## 中文乱码着实麻烦。将编码方式改为utf-8.
import sys
defaultencoding = 'utf-8'
if sys.getdefaultencoding() != defaultencoding:
    reload(sys)
    sys.setdefaultencoding(defaultencoding)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
    'Cookie': ''
}

url = 'https://app.mokahr.com/personal-center/applications?orgId=zte'


def sendMessage(token, mydata):
    baseurl = "http://wx.xtuis.cn/"
    url = baseurl + token + ".send"
    
    data = {
        "text": 'zte notification：'+mydata,
        "desp": ''
    }
    requests.post(url, data=data)


if __name__ == '__main__':
	try:
		res = requests.get(url=url, headers=headers)
		# fp = open('zte.json', 'w', encoding='utf-8')
		print(res.json())
		# json.dump(res.json(), fp, ensure_ascii=False)
		app_list = res.json()[0]['candidateApps'][0]['projectApps'][0]['apps']
		app = app_list[0]
		status = app['stage']
		print(status)
	except:
		status = 'error!'
		print('error!')
	if status != '面试':
		sendMessage('', status)

```

## 项目部署

webshell可以直接拖拽上传本地编写好的py文件，很方便。上传后，设置任务调度。核心命令就是linux的`crond`。参数：前面五个`*`设置执行时间间隔，后面跟命令。依次输入：

```shell
crontab -e ##进入vim编辑
60 * * * * python ../zte.py  ##注意要从根目录开始，写绝对路径。一小时执行一次。
crontab -l ##查看任务是否创建
```

如果py程序中有print语句用于调试等目的，可以打开mail。任务执行的打印语句会出现在mail中。

mail的翻页命令：`z`

# b系统

b系统的招聘系统是自研的。需要登录验证。由于cookie的有效时间很短，用requests麻烦，就用selenium工具，可以和脚本a做出差距。

## 代码
selenium模仿人操纵浏览器的行为。所以，主要就是找到想要点击的标签。其中，在登录后，要休眠一定时间，使浏览器能加载网页。

```python
# -*- coding:utf-8 -*-
 
from selenium import webdriver
from selenium.webdriver.common.by import By
from time import sleep
import sys
import requests
defaultencoding = 'utf-8'
if sys.getdefaultencoding() != defaultencoding:
    reload(sys)
    sys.setdefaultencoding(defaultencoding)
 
def sendMessage(token, mydata):
    baseurl = "http://wx.xtuis.cn/"
    url = baseurl + token + ".send"
    
    data = {
        "text": '华为招聘：'+mydata,
        "desp": ''
    }
    requests.post(url, data=data)


options = webdriver.ChromeOptions()
options.add_argument('--headless')  # 确保无头
options.add_argument('--disable-gpu')  # 无需要gpu加速
options.add_argument('--no-sandbox')  # 无沙箱
driver = webdriver.Chrome(executable_path="./chromedriver", chrome_options=options)  # 添加软链接后是不需要写路径的

if __name__ == '__main__':
	try:
		options = webdriver.ChromeOptions()
		options.add_argument('--headless')  # 确保无头
		options.add_argument('--disable-gpu')  # 无需要gpu加速
		options.add_argument('--no-sandbox')  # 无沙箱
		driver = webdriver.Chrome(executable_path="./chromedriver", chrome_options=options)
		driver.get("https://uniportal.huawei.com/uniportal/?redirect=https%3A%2F%2Fcareer.huawei.com%2Freccampportal%2Flogin_index.html%3Fredirect%3Dhttps%3A%2F%2Fcareer.huawei.com%2Freccampportal%2Fportal5%2Fcampus-recruitment.html%3Fi%3D46238")


		driver.find_element(By.ID, 'uid').send_keys('')
		driver.find_element(By.ID, 'password').send_keys('')
		driver.find_element(By.CLASS_NAME, 'login_submit_pwd_v2').click()

		sleep(5)

		driver.get('https://career.huawei.com/reccampportal/services/portal/portaluser/pro/getResumeLockSatus')
		page = driver.page_source
		code = driver.find_element(By.TAG_NAME, 'pre').text
		if code != '1':
			status = '可以撤回'
		else:
			status = '不变'
	except:
		status = '请求失败'
	
	print(status)
	if status == '可以撤回' or status == '请求失败':
		sendMessage('jDn7yKWZELMb1AAKJnGSle8EU', status)

driver.quit()
```
## 部署
我没想到部署是更麻烦的一步。首先需要给云服务器安装chrome和chromedriver。

首先安装chrome：

```shell
[root@localhost ~]#  cd /ect/yum.repos.d/
[root@localhost yum.repos.d]#  vim google-chrome.repo
```

vim模式编辑文件：

```
[google-chrome]
name=google-chrome
baseurl=http://dl.google.com/linux/chrome/rpm/stable/$basearch
enabled=1
gpgcheck=1
gpgkey=https://dl-ssl.google.com/linux/linux_signing_key.pub
```

```
[root@localhost yum.repos.d]# yum -y install google-chrome-stable --nogpgcheck
```

然后下载chromedriver，并把文件放到脚本所在文件夹：

```
wget https://npm.taobao.org/mirrors/chromedriver/83.0.4103.14/chromedriver_linux64.zip
unzip chromedriver_linux64.zip
```

最后一步，运行。因为selenium模块需要python3，centos默认的是python2.想了几种解决办法，包括把默认版本调至python3,用宝塔创建环境。但是最终选择用conda虚拟环境。主要参考的安装教程：[链接](https://blog.csdn.net/LJX_ahut/article/details/114282900)

切换到conda环境，运行指令`python huawei.py`,发现lighthouse用户不支持chrome,故`sudo python huawei.py`. 报错：chromedriver找不到。首先以为是环境和用户的问题，在crontab中添加相关语句也不管用，然后我知道了，代码中的driver路径要用绝对路径。


# 总结

学爬虫是有强大的正向激励的。之前秋招时经常守着页面刷新查看状态，很焦虑。现在可以放心了。我还要很多想法，比如b站虚拟主播生日会舰长数爬取，并自动制作表格等。