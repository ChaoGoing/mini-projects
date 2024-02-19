#!/usr/bin/env sh
# 判断环境变量 husky_skip_init 长度是否为0，为0则执行下面的内容
if [ -z "$husky_skip_init" ]; then
  # 声明 debug 函数，用来打印错误日志
  debug() {
    # "$HUSKY_DEBUG" = "1" 时打印
    echo "husky (debug) - $1"
    if [ "$HUSKY_DEBUG" = "1" ]; then
      echo "husky (debug) - $1"
    fi
  }

  # 声明一个只读参数，内容为 basename + hookname
  readonly hook_name="$(basename -- "$0")"
  debug "starting $hook_name..."

  # 判断环境变量 "$HUSKY" = "0" 是否成立，是则直接退出 (exit 0)
  if [ "$HUSKY" = "0" ]; then
    debug "HUSKY env variable is set to 0, skipping hook"
    exit 0
  fi

  # 判断 ~/.huskyrc 是否存在，存在的话直接执行
  if [ -f ~/.huskyrc ]; then
    debug "sourcing ~/.huskyrc"
    . ~/.huskyrc
  fi

  # 声明只读变量 husky_skip_init 并设置值为 1
  # sh -e "$0" "$@" => $0: shell文件名 $@: 所有参数列表 $?: 最后运行的命令的结束代码 => 再用 sh 执行一边当前脚本
  readonly husky_skip_init=1
  export husky_skip_init
  # debug "log $0" => .husky/pre-commit
  # debug "log $@" =>
  # debug "log $?" => 0
  sh -e "$0" "$@"
  exitCode="$?"

  # 当用户脚本返回错误时($exitCode != 0)，打印当前的 hook 名称 + 退出码
  if [ $exitCode != 0 ]; then
    echo "husky - $hook_name hook exited with code $exitCode (error)"
  fi

  # 当退出码为 127 时，环境变量 PATH 配置有误，打印 command not found in PATH 提示
  if [ $exitCode = 127 ]; then
    echo "husky - command not found in PATH=$PATH"
  fi

  exit $exitCode
fi