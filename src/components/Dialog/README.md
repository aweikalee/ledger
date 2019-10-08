# Dialog

---

## Dialog

其他组件一般情况都将放置在 Control 下，用于控制集中控制状态。
与子组件交互方式是通过 Context 传递的 Function 进行交互。

### Props

| 参数 | 说明 | 类型 | 默认值 |
|---|---|---|---|
|cancelText|取消按钮的文字|`string`|取消|
|closeIcon|显示右上角的关闭按钮|`boolean`|true|
|confirmText|确认按钮的文字|`string`|确定|
|footer|设置后将会代替原有的footer, 设置null则为不显示|`ReactNode`|-|
|onCancel|取消按钮的回调|`Function`|onClose|
|onClickClose|关闭按钮的回调|`Function`|onClose|
|onClickOverlay|点击遮罩的回调|`Function`|onClose|
|onClose|取消事件 (将会作为 onCancel, onClickOverlay, onClickClose 的默认值)|`Function`|-|
|onConfirm|确认按钮的回调|`Function`|-|
|title|标题|`string`|-|
|show|显示|`boolean`|false|

以及 Modal 的其他属性