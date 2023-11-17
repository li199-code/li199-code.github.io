---
title: nestjs入门
author: Jason Lee
date: 2023-07-31 15:50:40
tags: nestjs
categories:
---

## 前言

软开团队之前做过的一个项目，用 nestjs 做的。我听到时很惊讶，部门负责人竟然这么敢用当时看起来还那么稚嫩的 nodejs 作为后端语言。让我们开始吧。

## 安装

类似于 vue2，也要安装一个脚手架。启动后，访问 localhost:3000，出现一个朴实无华的 Hello world，甚至没有用标题 html 标签：

![16907906119941690790611215.png](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16907906119941690790611215.png)

## nestjs 和 express 的关系

> NestJS 和 Express 之间有密切的关系，可以将 NestJS 视为建立在 Express 之上的框架。NestJS 的 HTTP 模块和功能实际上是建立在 Express 的基础之上的，并且可以与 Express 的功能无缝交互。

> 具体来说，NestJS 在底层使用 Express 来处理 HTTP 请求和构建 Web 应用程序。这意味着，NestJS 的 HTTP 模块实际上是使用 Express 的路由和中间件系统来定义路由和处理请求。因此，你可以在 NestJS 应用程序中直接使用 Express 中的中间件，也可以使用 NestJS 提供的中间件。

> 虽然 NestJS 在底层使用了 Express，但它为开发者提供了一种更现代、模块化的方法来构建应用程序。NestJS 引入了一系列新的概念，如模块、控制器、提供者、依赖注入等，这些使得代码更易于组织、测试和维护。此外，NestJS 还支持多种其他功能，如 WebSocket、GraphQL 等，可以让你构建更强大的应用程序。

> 总的来说，NestJS 是建立在 Express 之上的，它保留了 Express 的灵活性和强大性能，同时为开发者提供了更高级的抽象和功能，使得构建复杂的服务器端应用程序更加容易和愉快。

## 项目结构

我是跟着油管的[教程](https://www.youtube.com/watch?v=xzu3QXwo1BU&list=PL_cUvD4qzbkw-phjGK2qq0nQiG6gw1cKK&index=2&ab_channel=AnsontheDeveloper)敲了一个基础小项目。下面是项目目录的截图。

![16909392755291690939274607.png](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16909392755291690939274607.png)

nestjs 推荐通过脚手架工具来生成代码文件，这样的初始代码来自模板文件。所有可自动生成的文件如下：

![16909397445231690939744129.png](https://fastly.jsdelivr.net/gh/li199-code/blog-imgs@main/16909397445231690939744129.png)

这里和我熟悉的 django 框架做一个对比。

| nestjs      | django     | nest-cli                                          | 说明                         |
| ----------- | ---------- | ------------------------------------------------- | ---------------------------- |
| module      | app        | nest generate module users                        | 模块                         |
| controllers | urls.py    | nest generate controller /users/controllers/users | 路由                         |
| services    | views.py   | nest g s /users/services/users                    | 视图，运行逻辑代码           |
| pipes       | forms.py   | nest g pipe /users/pipes/ValidateCreateUser       | 对表单或者传来的数据进行验证 |
| middleware  | middleware | nest g mi /users/middlewares/example              | 中间件                       |
| guard       | 权限装饰器 | nest g guard /users/guards/Auth                   | 权限控制                     |

其它的，`app.module.ts`对模块进行注册，相当于 django 中 settings.py 中的 INSTALLED_APPS。

## DTO(Data Transfer Object)

在 NestJS 中，DTO（Data Transfer Object）是一种用于数据传输的对象。DTO 主要用于在应用程序的不同层之间传输数据，通常在控制器（Controller）层和服务（Service）层之间进行数据传递。DTO 的目的是将数据从一个地方传输到另一个地方，并在传输过程中进行数据验证和转换。

DTO 在应用程序中扮演了重要的角色，特别是在处理 HTTP 请求和响应的过程中。它们可以用于将请求数据从控制器传递给服务，也可以用于将服务返回的数据转换为适合返回给客户端的格式。

通常，DTO 对象会在不同层之间定义，并在控制器和服务中使用。DTO 可以用于以下几个方面：

请求数据验证：在控制器中，DTO 可以用于验证客户端传递的请求数据是否符合预期的格式和规则。通过使用装饰器来定义 DTO 类的属性，NestJS 可以自动验证传入的数据，并根据定义的规则返回验证错误。

数据传输：在服务层和控制器之间传递数据。服务层可以接收 DTO 对象，执行相应的业务逻辑，然后返回 DTO 对象，控制器再将其转换为 HTTP 响应返回给客户端。

数据转换：DTO 可以用于将服务返回的数据转换为适合返回给客户端的格式。例如，将数据库查询的结果转换为 JSON 格式返回给客户端。

隐藏敏感信息：在某些情况下，DTO 可以用于隐藏敏感信息，确保客户端只能获得必要的数据而不会暴露不应该看到的信息。

在 NestJS 中，你可以使用 @nestjs/swagger 模块来自动生成 API 文档，并自动将 DTO 类中的装饰器用于验证请求数据。

下面是一个简单的例子，展示了在 NestJS 中定义一个 DTO 类的示例：

```
import { IsString, IsInt } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly name: string;

  @IsInt()
  readonly age: number;

  @IsString()
  readonly email: string;
}
```

在上面的例子中，我们定义了一个 CreateUserDto 类，该类用于在控制器中接收创建用户的请求数据。使用 @IsString() 和 @IsInt() 装饰器来定义每个属性的验证规则。在控制器中，我们可以使用该 DTO 类来验证客户端传入的数据是否符合预期的规则。

## 两处类型验证的区别

由于请求传入参数和保存在数据库的参数可能不一致，所以需要两种验证。请求参数的验证时 放在 dtos 文件夹下，在 controller 中使用。而保存数据库的验证放在 utils 文件夹，在 service 层使用。

## 依赖注入

GPT：

依赖注入是一种编程的方式，用于管理代码中不同部分之间的依赖关系。在软件开发中，一个模块可能会需要使用另一个模块提供的功能或数据，而依赖注入就是一种让这种关系更加松散和可维护的方法。

举个例子，假设你在开发一个网站后端，使用了 NestJS 这个框架。你需要创建一些控制器来处理不同的请求，同时还需要连接数据库来存储和检索数据。这时就涉及到依赖关系：控制器依赖于数据库连接来获取数据。

在使用依赖注入之前，你可能会在每个控制器内部创建数据库连接，但这会导致代码重复和难以维护。而使用依赖注入，你可以这样做：

定义一个数据库连接的服务（或者称之为提供者）：在 NestJS 中，你可以创建一个类，用于创建和管理数据库连接。

在控制器中声明依赖：在你的控制器类中，你可以声明需要使用的依赖，比如数据库连接。

在模块中设置依赖关系：在 NestJS 中，你需要将控制器和提供者（数据库连接）放入同一个模块中，并在模块的配置中告诉 NestJS 如何建立这些依赖关系。

NestJS 完成注入：当你启动应用程序时，NestJS 将根据你在模块中的配置，自动将数据库连接注入到控制器中。这意味着你不必自己管理控制器和连接之间的关系，NestJS 会帮你处理。

通过依赖注入，你可以更好地组织代码，降低模块之间的耦合度，使得代码更容易测试和维护。

下面是一个伪代码示例，演示如何在 NestJS 中使用依赖注入：

```
// 数据库连接提供者
@Injectable()
class DatabaseService {
  connect() {
    // 连接数据库的逻辑
  }
}

// 控制器
@Controller()
class UserController {
  constructor(private databaseService: DatabaseService) {}

  getUser(id: number) {
    const user = this.databaseService.fetchUser(id);
    return user;
  }
}

// 模块配置
@Module({
  providers: [DatabaseService],
  controllers: [UserController],
})
class UserModule {}
```

在这个示例中，DatabaseService 负责数据库连接，UserController 控制器依赖于 DatabaseService 来获取用户信息。在 UserModule 模块中，我们通过将 DatabaseService 提供者添加到 providers 列表中，将 UserController 控制器添加到 controllers 列表中，NestJS 将自动完成依赖注入。

**简单来说，nestjs 的依赖注入，就类似于 django 中的 urls 和 views 相分离。**
