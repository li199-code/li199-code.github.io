---
title: 校园网自动登录+win10开机执行脚本
date: 2022-11-18 14:11:31
tags: 
- selenium
- 自动化
- 爬虫
---
# 问题的提出

痛点：校园网的登录比较迷，我主要用的chrome，按理说只要连上无线，就要马上弹出登录界面。但是，chrome就是不行，即使将登录页面保存为书签，登录后却不能上网。这方面，firefox可以解决。firefox每次启动会检查是否需要登录强制门户。[文章链接](https://support.mozilla.org/zh-CN/kb/%E5%BC%BA%E5%88%B6%E9%97%A8%E6%88%B7%E6%8E%A2%E6%B5%8B).所以我打算用selenium请求[这个网址](http://detectportal.firefox.com/canonical.html),自动登录。

<!-- more -->

# 代码编写

先贴出代码：

```python

# -*- coding:utf-8 -*-

from selenium import webdriver
from selenium.webdriver.common.by import By
from time import sleep
import sys
import requests
defaultencoding = 'utf-8'
import warnings
warnings.filterwarnings("ignore",category=DeprecationWarning)
import os
import subprocess

if sys.getdefaultencoding() != defaultencoding:
    reload(sys)
    sys.setdefaultencoding(defaultencoding)

def login():
	driver = webdriver.Firefox() 
	driver.get("http://detectportal.firefox.com/canonical.html")
	# sleep(3)

	driver.find_element(By.XPATH, '//*[@id="edit_body"]/div[2]/div[4]/form/input[3]').send_keys('')
	driver.find_element(By.XPATH, '//*[@id="edit_body"]/div[2]/div[4]/form/input[4]').send_keys('')
	driver.find_element(By.XPATH, '//*[@id="edit_body"]/div[2]/div[4]/form/input[2]').click()

	sleep(3)

	driver.close()

def get_current_wifi():
	cmd = 'netsh wlan show interfaces'
	p = subprocess.Popen(cmd,
			stdin=subprocess.PIPE,
			stdout=subprocess.PIPE,
			stderr=subprocess.PIPE,
			shell=True)
	ret = p.stdout.read().decode()
	index = ret.find("SSID")
	if index > 0:
		return ret[index:].split(':')[1].split('\r\n')[0].strip()		
	else:
		return None

def check_ping(ip, count=1, timeout=1000):
    cmd = 'ping -n %d -w %d %s > NUL' % (count, timeout, ip)
    res = os.system(cmd)
    return 'ok' if res == 0 else 'failed'

def switch_wifi():
    cmd = 'netsh wlan connect name=CHINANET'
    res = os.system(cmd)
    return 'ok' if res == 0 else 'failed'

if __name__ == '__main__':

	## 获取当前wifi
	ipTest = '61.135.169.121'
	current_wifi = get_current_wifi()
	print("当前的wifi为：", current_wifi)

	## 如果没连上电信，试着连接，失败说明不在学校，退出程序
	if current_wifi != "CHINANET":
		if switch_wifi() == 'ok':
			print('连接电信成功')
		else:
			print('不在学校内！')
			sys.exit()

	## 测试电信是否有网，没网就登录校园网账号
	if check_ping(ipTest, 2) == 'ok':
		print('电信校园网已登录！')
	else:
		print('正在登录校园网...')
		login()
		if check_ping(ipTest, 2) == 'ok':
			print('登录成功，可以上网！')
		else:
			print('登录失败，打开程序检查！')

```

在主函数部分，我小小地设计了一下，避免了过多if嵌套，提高了可读性。

# 脚本部署

由于是在自己的主力机上部署，所以是windows的自动任务。win上的开机任务设置就是一堆图形化界面按流程点点点就行了。我的[参考链接](https://cloud.tencent.com/developer/article/1466109)。

# 效果

开机会出现一个命令行窗口，脚本自动执行，没登陆的会打开firefox.
