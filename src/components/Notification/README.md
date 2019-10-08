# Notification

消息通知队列，目前只能显示在右上角。

---

## API
- notification.open(config)
- notification.info(config)
- notification.success(config)
- notification.error(config)
- notification.warn(config)
- notification.close(key: string)
- notification.destroy()

## config 参数
| 参数     | 说明                                     | 类型                              | 默认值 |
|----------|------------------------------------------|-----------------------------------|--------|
| type     | 图标样式                                 | `'info'|'success'|'error'|'warn'` | `-`    |
| content  | 消息内容                                 | `ReactNode`                       | `-`    |
| duration | 默认 2 秒后自动关闭，设为 0 则不自动关闭 | `number`                          | `2`    |
| key      | 当前通知标识（用于API.close）            | `string`                          | `-`    |
| onClose  | 点击默认关闭按钮时触发的回调函数         | `Function`                        | `-`    |