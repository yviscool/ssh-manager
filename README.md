# SSH Manager

![Continuous Integration checks](https://github.com/Webdown404/ssh-manager/workflows/Continuous%20Integration%20checks/badge.svg)
![Security Audit](https://github.com/Webdown404/ssh-manager/workflows/Security%20Audit/badge.svg)

 Inspired by [ssh-manager](https://github.com/Webdown404/ssh-manager)
 Inspired by [deepin-terminal](https://github.com/linuxdeepin/deepin-terminal/blob/4068a27936efd814a97e423f06756abd081b697c/src/assets/other/ssh_login.sh)

## Requirement
This project required :
- node >= 10
- npm

## Presentation
This node module provide a way to store several SSH configurations into a centralized SSH manager. With it, you can create / modify / delete an SSH connection configuration and start an SSH connection.

![](./media/1.gif)

## Installation
To install this project globally :
```shell
npm install -g @yungvenuz/ssh-manager-cli
```

## Start

### Configuration
To configure a new / existing SSH connection, use the `config` command :
```shell
ssh-manager config
```

The connection configuration file is save into your home directory `~/.ssh-manager/connection_configuration.json`.

### Connection
To start an SSH connection, use the `connect` command:
```shell
ssh-manager connect
```

> **note**: you can also just use `ssh-manager` without command

### Help
The application documentation is available with `--help` option :
```shell
ssh-manager --help
```
