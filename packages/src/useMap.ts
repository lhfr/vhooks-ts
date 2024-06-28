import { ref, Ref } from "vue";

type MapOrEntries<K, V> = Map<K, V> | [K, V][];

type UseMapActions<K, V> = {
  set: (key: K, value: V) => void;
  setAll: (entries: MapOrEntries<K, V>) => void;
  remove: (key: K) => void;
  reset: Map<K, V>["clear"];
};

type UseMapReturn<K, V> = [
  Ref<Omit<Map<K, V>, "set" | "clear" | "delete">>,
  UseMapActions<K, V>
];

export function useMap<K, V>(
  initialState: MapOrEntries<K, V> = new Map()
): UseMapReturn<K, V> {
  const map = ref(new Map(initialState)) as Ref<
    Omit<Map<K, V>, "set" | "clear" | "delete">
  >;

  const actions: UseMapActions<K, V> = {
    set: (key: K, value: V) => {
      const copy = new Map(map.value);
      copy.set(key, value);
      map.value = copy;
    },

    setAll: (entries: MapOrEntries<K, V>) => {
      map.value = new Map(entries);
    },

    remove: (key: K) => {
      const copy = new Map(map.value);
      copy.delete(key);
      map.value = copy;
    },

    reset: () => {
      map.value = new Map();
    },
  };

  return [map, actions];
}
