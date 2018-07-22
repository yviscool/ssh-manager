# SSH Manager

[![Build Status](https://travis-ci.org/Webdown404/ssh-manager.svg?branch=master)](https://travis-ci.org/Webdown404/ssh-manager)

## Requirement
This project required :
- node >= 7.10.1
- npm

## Presentation
This node module provide a way to store several SSH configurations into a centralized SSH manager. With it, you can create / modify / delete an SSH connection configuration and start an SSH connection.

![](http://i.imgur.com/GgEqTfo.gif)

## Installation
To install this project globally :
```shell
npm install -g ssh-manager-cli
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