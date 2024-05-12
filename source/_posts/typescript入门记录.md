---
title: typescript入门记录
author: Jason Lee
tags: typescript
abbrlink: e0862921
date: 2023-08-04 09:29:21
updated: 2024-05-02 00:00:00
categories:
---

## typescript 的工作方式

首先要明白，在 javascript 存在了这么多年的情况下，为什么发明 typescript？js 能运行一些非常奇葩的代码，比如:

```
console.log(1+'1') //'11'
```

在其他语言，包括同为动态语言的 python，都会报错，而 js 则会正常输出结果。这就会带来很多问题。因此，有必要对 js 进行类型检查。

ts 就是一个类型检查的工具。运行上，它依赖于 nodejs，需要安装一个 tsc 工具，在编写完 ts 代码后，需要用 tsc 转为 js 代码，才能被浏览器或者 nodejs 执行。因此，写 ts 时，往往会在类型上设置两道关卡，第一是 vscode 提供的提示，第二是编译时的错误提醒。另外，ts 不能在代码运行时提供类型检查，

## typescript 基本例子

```
// Basic Types
let id: number = 5
let company: string = 'Traversy Media'
let isPublished: boolean = true
let x: any = 'Hello'

let ids: number[] = [1, 2, 3, 4, 5]
let arr: any[] = [1, true, 'Hello']

// Tuple
let person: [number, string, boolean] = [1, 'Brad', true]
// Tuple Array
let employees: [number, string][]

employee = [
  [1, 'Brad'],
  [2, 'John'],
  [3, 'Jill'],
]

// Union
let pid: string | number
pid = '22'

// Enum
enum Direction1 {
  Up = 1,
  Down,
  Left,
  Right,
}

enum Direction2 {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right',
}

// Objects
type User = {
  id: number
  name: string
}

const user: User = {
  id: 1,
  name: 'John',
}

// Type Assertion
let cid: any = 1
// let customerId = <number>cid
let customerId = cid as number

// Functions
function addNum(x: number, y: number): number {
  return x + y
}

// Void
function log(message: string | number): void {
  console.log(message)
}

// Interfaces
interface UserInterface {
  readonly id: number
  name: string
  age?: number
}

const user1: UserInterface = {
  id: 1,
  name: 'John',
}

interface MathFunc {
  (x: number, y: number): number
}

const add: MathFunc = (x: number, y: number): number => x + y
const sub: MathFunc = (x: number, y: number): number => x - y

interface PersonInterface {
  id: number
  name: string
  register(): string
}

// Classes
class Person implements PersonInterface {
  id: number
  name: string

  constructor(id: number, name: string) {
    this.id = id
    this.name = name
  }

  register() {
    return `${this.name} is now registered`
  }
}

const brad = new Person(1, 'Brad Traversy')
const mike = new Person(2, 'Mike Jordan')

// Subclasses
class Employee extends Person {
  position: string

  constructor(id: number, name: string, position: string) {
    super(id, name)
    this.position = position
  }
}

const emp = new Employee(3, 'Shawn', 'Developer')

// Generics
function getArray<T>(items: T[]): T[] {
  return new Array().concat(items)
}

let numArray = getArray<number>([1, 2, 3, 4])
let strArray = getArray<string>(['brad', 'John', 'Jill'])

strArray.push(1) // Throws error
```

## 相关工具使用感受

目前已知的运行 ts 的工具有两个：tsc 和 ts-node。前者是将代码转为 js 代码，这意味着运行一段代码还要分两次运行。后者倒是可以直接运行，无需分步。但是，即使是一个两行代码的 ts 文件，这两个工具都要运行大概 2 秒钟才能出结果，相对于`node xx.js`的体验肯定是差不少。

## ts 特性

- TypeScript 的设计思想是，类型声明是可选的，你可以加，也可以不加。即使不加类型声明，依然是有效的 TypeScript 代码，只是这时不能保证 TypeScript 会正确推断出类型。由于这个原因，所有 JavaScript 代码都是合法的 TypeScript 代码。这样设计还有一个好处，将以前的 JavaScript 项目改为 TypeScript 项目时，你可以逐步地为老代码添加类型，即使有些代码没有添加，也不会无法运行。

## 最佳实践

我觉得最佳实践可能是学习 typescript 过程中非常重要的一部分。因为任何 js 代码都是合法的 ts。如何有选择性的加上类型声明，恰当发挥 ts 的优势，总结起来就是最佳实践。

- 利用类型推断功能，不必在所有变量和参数后加类型声明。
- 命名函数时要加上入参和出参的类型声明。
- 用 interface 给 object 类型的对象添加声明。
