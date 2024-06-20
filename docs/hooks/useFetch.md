# useFetch

这里是一个 Vue Hook，旨在使用原生 Fetch API 在 API 上检索数据。我使用了一个 reducer 来分离状态逻辑，并通过函数风格简化测试。

## Usage

```vue
<template>
  <p v-if="state.error">There is an error.</p>
  <p v-if="!state.data">Loading...</p>
  <p v-else>{{ state.data[0].title }}</p>
</template>

<script lang="ts" setup>
import { useFetch } from "vhooks-ts";

const url = `http://jsonplaceholder.typicode.com/posts`;
const { state } = useFetch(url);
</script>
```

## Hook

```js
import { type Ref, type UnwrapRef, ref, watchEffect } from 'vue'

interface State<T> {
  data?: T
  error?: Error
}

type Action<T> =
  | { type: 'loading' }
  | { type: 'fetched'; payload: UnwrapRef<T> }
  | { type: 'error'; payload: Error }

function useReducer<T>(
  reducer: (state: UnwrapRef<State<T>>, action: Action<T>) => UnwrapRef<State<T>>,
  initialState: State<T>
): {
  state: Ref<UnwrapRef<State<T>>>
  dispatch: (action: Action<T>) => void
} {
  const state = ref(initialState)
  const dispatch = (action: Action<T>) => {
    state.value = reducer(state.value, action)
  }
  return { state, dispatch }
}

export default function useFetch<T>(url: string, options?: RequestInit) {
  const cache = ref<{ [url: string]: UnwrapRef<T> }>({})
  const cancelRequest = ref(false)

  const initialState = {
    error: undefined,
    data: undefined
  }
  const reducer = (state: UnwrapRef<State<T>>, action: Action<T>): UnwrapRef<State<T>> => {
    switch (action.type) {
      case 'loading':
        return { ...initialState }
      case 'fetched':
        return { ...initialState, data: action.payload }
      case 'error':
        return { ...initialState, error: action.payload }
      default:
        return state
    }
  }
  const { state, dispatch } = useReducer(reducer, initialState)

  watchEffect(() => {
    cancelRequest.value = false

    const fetchData = async () => {
      dispatch({ type: 'loading' })
      if (cache.value[url]) {
        dispatch({ type: 'fetched', payload: cache.value[url] })
        return
      }
      try {
        const response = await fetch(url, options)
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        cache.value[url] = await response.json()
        if (cancelRequest.value) return
        dispatch({ type: 'fetched', payload: cache.value[url] })
      } catch (error) {
        if (cancelRequest.value) return
        dispatch({ type: 'error', payload: error as Error })
      }
    }

    fetchData()

    return () => {
      cancelRequest.value = true
    }
  })

  return { state }
}
```
