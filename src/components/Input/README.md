# Input

---

## Control

其他组件一般情况都将放置在 Control 下，用于控制集中控制状态。
与子组件交互方式是通过 Context 传递的 Function 进行交互。

### Props

```ts
interface I {
    error?: boolean // 应用 error 状态的样式
    disabled?: boolean // 应用 disabled 状态的样式
}
```
以及div所具有的属性

### Context

```ts
interface I {
    focus: boolean // 当 Input focus 时，会被设为 true
    error?: boolean // 即 props.error
    disabled?: boolean // 即 props.disabled
    onFocus: Function // 当 Input focus 时 触发的回调
    onBlur: Function // 当 Input blur 时 触发的回调
}
```

### 使用方法
``` jsx
<Input.Control>
    <Input.Input />
</Input.Control>
```

---

## Input

---

## TextArea

---

## Label

标签，等同于原生的 label。样式可由 Control 控制

### Props
``` ts
interface I {
    description?: React.ReactNode // 描述
}
```
以及label所具有的属性

### 使用方法
``` jsx
<Input.Label description="描述">标签</Input.Label>
```

---

## Helper

帮助内容，一般是用于显示错误信息。当 children 为空则不会渲染。

### Props
``` ts
interface I {
    error?: boolean
}
```
以及div所具有的属性