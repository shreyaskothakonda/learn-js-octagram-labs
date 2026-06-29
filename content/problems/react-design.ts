import type { Problem, CourseRef } from "../types";
const cr = (section: number, sectionTitle: string, lecture: number, lectureName: string): CourseRef =>
  ({ section, sectionTitle, lecture, lectureName });
const FN = cr(17, "Modern JavaScript Development: Modules, Tooling, and Functional", 294, "Declarative and Functional JavaScript Principles");
const CLO = cr(10, "A Closer Look at Functions", 144, "Closures");
const SPREAD = cr(9, "Data Structures, Modern Operators and Strings", 111, "The Spread Operator (...)");
const r = (label: string, url: string) => [{ label, url }];
const RX = "https://react.dev/learn";

export const reactDesignProblems: Problem[] = [
  // ===== Reducers =====
  {
    id: "react-reducer-008", track: "react", topic: "Reducers", difficulty: "medium",
    title: "Todo Reducer (full)",
    prompt: "Write a complete todo reducer driven by dispatched actions.\n\nImplement `todoReducer(state, action)` where state is an array of `{ text, done }`:\n- `{ type: 'add', text }` appends `{ text, done: false }`.\n- `{ type: 'toggle', index }` flips that todo's done.\n- `{ type: 'remove', index }` removes it.\n- `{ type: 'clearCompleted' }` drops all done todos.\nUnknown actions return the state unchanged. All updates immutable.",
    kind: "harness",
    starterCode: "function todoReducer(state, action) {\n  // handle add, toggle, remove, clearCompleted\n}",
    solution: "function todoReducer(state, action) {\n  switch (action.type) {\n    case 'add': return [...state, { text: action.text, done: false }];\n    case 'toggle': return state.map((t, i) => (i === action.index ? { ...t, done: !t.done } : t));\n    case 'remove': return state.filter((_, i) => i !== action.index);\n    case 'clearCompleted': return state.filter((t) => !t.done);\n    default: return state;\n  }\n}",
    examples: [{ input: "add 'a', add 'b', toggle 0, remove 1", output: "[{ text: 'a', done: true }]", explanation: "After adding a and b, toggling index 0 marks a done; removing index 1 drops b." }],
    testCases: [
      { description: "add a, add b, toggle 0, remove 1", run: "let s = []; s = todoReducer(s, {type:'add', text:'a'}); s = todoReducer(s, {type:'add', text:'b'}); s = todoReducer(s, {type:'toggle', index:0}); s = todoReducer(s, {type:'remove', index:1}); return s;", expected: [{ text: "a", done: true }] },
      { description: "clearCompleted", run: "return todoReducer([{text:'x',done:true},{text:'y',done:false}], {type:'clearCompleted'});", expected: [{ text: "y", done: false }] },
      { run: "return todoReducer([{text:'z',done:false}], {type:'noop'});", expected: [{ text: "z", done: false }], hidden: true },
    ],
    hints: ["Switch on action.type and return a new array each time.", "Unknown actions must return the same state."],
    pitfalls: ["Mutating todos in place (push, t.done = ...) instead of returning new arrays/objects."],
    explanation: "A reducer is a pure (state, action) function. Each case builds new immutable state, which is exactly how useReducer expects updates.",
    course: FN, resources: r("React: useReducer", "https://react.dev/reference/react/useReducer"),
  },
  {
    id: "react-reducer-009", track: "react", topic: "Reducers", difficulty: "easy",
    title: "Fold Actions over a Counter",
    prompt: "Implement `counterReducer(state, action)` (`inc`, `dec`, `reset`, default unchanged) so it can be folded over an action list with reduce.",
    kind: "harness",
    starterCode: "function counterReducer(state, action) {\n  // your code here\n}",
    solution: "function counterReducer(state, action) {\n  switch (action.type) {\n    case 'inc': return state + 1;\n    case 'dec': return state - 1;\n    case 'reset': return 0;\n    default: return state;\n  }\n}",
    examples: [{ input: "[inc, inc, dec, reset, inc] reduced from 0", output: "1", explanation: "0,1,2,1,0,1 — the running result after each action." }],
    testCases: [
      { description: "reduce a sequence from 0", run: "const actions = [{type:'inc'},{type:'inc'},{type:'dec'},{type:'reset'},{type:'inc'}]; return actions.reduce(counterReducer, 0);", expected: 1 },
      { description: "from a starting value", run: "return [{type:'inc'},{type:'inc'}].reduce(counterReducer, 5);", expected: 7 },
      { run: "return [].reduce(counterReducer, 3);", expected: 3, hidden: true },
    ],
    hints: ["A reducer is just a function reduce can fold with.", "The default case returns the accumulator unchanged."],
    pitfalls: ["Forgetting the default case yields undefined for unknown actions."],
    explanation: "Because a reducer is pure, folding it over an action list replays a sequence of dispatches to the final state.",
    course: FN, resources: r("React: useReducer", "https://react.dev/reference/react/useReducer"),
  },
  {
    id: "react-reducer-010", track: "react", topic: "Reducers", difficulty: "medium",
    title: "Cart Reducer with Quantities",
    prompt: "Implement `cartReducer(state, action)` where state is an array of `{ id, qty }`:\n- `{ type: 'add', id }` increments qty or appends `{ id, qty: 1 }`.\n- `{ type: 'setQty', id, qty }` sets the quantity.\n- `{ type: 'remove', id }` removes the line. All immutable.",
    kind: "harness",
    starterCode: "function cartReducer(state, action) {\n  // your code here\n}",
    solution: "function cartReducer(state, action) {\n  switch (action.type) {\n    case 'add': {\n      const exists = state.some((i) => i.id === action.id);\n      if (exists) return state.map((i) => (i.id === action.id ? { ...i, qty: i.qty + 1 } : i));\n      return [...state, { id: action.id, qty: 1 }];\n    }\n    case 'setQty': return state.map((i) => (i.id === action.id ? { ...i, qty: action.qty } : i));\n    case 'remove': return state.filter((i) => i.id !== action.id);\n    default: return state;\n  }\n}",
    examples: [{ input: "add 1, add 1, add 2, setQty(1,5), remove 2", output: "[{ id: 1, qty: 5 }]", explanation: "Item 1 is added then incremented then set to 5; item 2 is added then removed." }],
    testCases: [
      { description: "add, increment, set, remove", run: "let s = []; s = cartReducer(s, {type:'add', id:1}); s = cartReducer(s, {type:'add', id:1}); s = cartReducer(s, {type:'add', id:2}); s = cartReducer(s, {type:'setQty', id:1, qty:5}); s = cartReducer(s, {type:'remove', id:2}); return s;", expected: [{ id: 1, qty: 5 }] },
      { description: "add new line", run: "return cartReducer([], {type:'add', id:9});", expected: [{ id: 9, qty: 1 }] },
      { run: "return cartReducer([{id:1,qty:1}], {type:'add', id:1});", expected: [{ id: 1, qty: 2 }], hidden: true },
    ],
    hints: ["For add, check whether the id already exists.", "Map to a new object when incrementing; spread for a new line otherwise."],
    pitfalls: ["Mutating the matched line's qty in place.", "Adding a duplicate line instead of incrementing."],
    explanation: "The reducer handles each cart action immutably, the pattern behind a useReducer-managed cart.",
    course: FN, resources: r("React: useReducer", "https://react.dev/reference/react/useReducer"),
  },

  // ===== Hooks Logic =====
  {
    id: "react-hooks-004", track: "react", topic: "Hooks Logic", difficulty: "hard",
    title: "Minimal Redux-style Store",
    prompt: "Build a tiny store.\n\nImplement `createStore(reducer, initialState)` returning an object with:\n- `getState()` returns the current state.\n- `dispatch(action)` runs the reducer and notifies all subscribers.\n- `subscribe(listener)` registers a listener called on every dispatch.",
    kind: "harness",
    starterCode: "function createStore(reducer, initialState) {\n  // return { getState, dispatch, subscribe }\n}",
    solution: "function createStore(reducer, initialState) {\n  let state = initialState;\n  const listeners = [];\n  return {\n    getState() { return state; },\n    dispatch(action) { state = reducer(state, action); listeners.forEach((l) => l()); },\n    subscribe(listener) { listeners.push(listener); },\n  };\n}",
    examples: [{ input: "inc reducer; subscribe a counter; dispatch inc, inc, noop", output: "[2, 3]", explanation: "State ends at 2; the subscriber fired on all three dispatches." }],
    testCases: [
      { description: "dispatch notifies subscribers", run: "const reducer = (s, a) => (a.type === 'inc' ? s + 1 : s); const store = createStore(reducer, 0); let calls = 0; store.subscribe(() => calls++); store.dispatch({type:'inc'}); store.dispatch({type:'inc'}); store.dispatch({type:'noop'}); return [store.getState(), calls];", expected: [2, 3] },
      { description: "state updates via reducer", run: "const store = createStore((s, a) => s + a.n, 10); store.dispatch({n:5}); return store.getState();", expected: 15 },
      { run: "const store = createStore((s) => s, 'x'); return store.getState();", expected: "x", hidden: true },
    ],
    hints: ["Hold state and a listeners array in the closure.", "dispatch updates state then calls every listener."],
    pitfalls: ["Notifying subscribers before updating state.", "Not capturing state privately in the closure."],
    explanation: "A closure holds private state and listeners; dispatch threads the reducer and notifies subscribers, the core of Redux.",
    course: CLO, resources: r("React: Scaling Up with Reducer and Context", "https://react.dev/learn/scaling-up-with-reducer-and-context"),
  },
  {
    id: "react-hooks-005", track: "react", topic: "Hooks Logic", difficulty: "medium",
    title: "useCounter Logic",
    prompt: "Implement `useCounter(initial)` returning an object with `increment()`, `decrement()`, `reset()`, and `value()`, keeping the count private (the logic behind a useState counter hook).",
    kind: "harness",
    starterCode: "function useCounter(initial) {\n  // return { increment, decrement, reset, value }\n}",
    solution: "function useCounter(initial) {\n  let count = initial;\n  return {\n    increment() { count++; },\n    decrement() { count--; },\n    reset() { count = initial; },\n    value() { return count; },\n  };\n}",
    examples: [{ input: "useCounter(0): increment, increment, decrement, value, reset, value", output: "[1, 0]", explanation: "After +1 +1 -1 the value is 1; reset returns it to the initial 0." }],
    testCases: [
      { description: "increment/decrement/reset", run: "const c = useCounter(0); c.increment(); c.increment(); c.decrement(); const a = c.value(); c.reset(); const b = c.value(); return [a, b];", expected: [1, 0] },
      { description: "starts at initial", run: "const c = useCounter(5); c.increment(); return c.value();", expected: 6 },
      { run: "const c = useCounter(3); c.decrement(); c.decrement(); return c.value();", expected: 1, hidden: true },
    ],
    hints: ["A closed-over variable holds the count.", "reset restores the original initial value."],
    pitfalls: ["Returning the count by value instead of through a value() accessor freezes it."],
    explanation: "The closure keeps count private and the returned methods mutate it, mirroring a custom counter hook's behavior.",
    course: CLO, resources: r("React: Reusing Logic with Custom Hooks", "https://react.dev/learn/reusing-logic-with-custom-hooks"),
  },
  {
    id: "react-hooks-006", track: "react", topic: "Hooks Logic", difficulty: "easy",
    title: "useToggle Logic",
    prompt: "Implement `useToggle(initial)` returning `{ toggle(), value() }` where toggle flips a boolean and value reads it.",
    kind: "harness",
    starterCode: "function useToggle(initial) {\n  // return { toggle, value }\n}",
    solution: "function useToggle(initial) {\n  let state = initial;\n  return { toggle() { state = !state; }, value() { return state; } };\n}",
    examples: [{ input: "useToggle(false): toggle, toggle, toggle, value", output: "true", explanation: "Three toggles from false end at true." }],
    testCases: [
      { description: "toggle three times", run: "const t = useToggle(false); t.toggle(); t.toggle(); t.toggle(); return t.value();", expected: true },
      { description: "toggle once from true", run: "const t = useToggle(true); t.toggle(); return t.value();", expected: false },
      { run: "const t = useToggle(false); return t.value();", expected: false, hidden: true },
    ],
    hints: ["Hold the boolean in the closure and flip it on toggle."],
    pitfalls: ["Recreating state inside toggle resets it each call."],
    explanation: "A closure variable flipped by toggle implements the classic useToggle hook logic.",
    course: CLO, resources: r("React: Custom Hooks", "https://react.dev/learn/reusing-logic-with-custom-hooks"),
  },

  // ===== Immutable State =====
  {
    id: "react-imstate-008", track: "react", topic: "Immutable State", difficulty: "medium",
    title: "Apply a Sequence of Updates",
    prompt: "Implement `applyUpdates(state, updates)` that folds an array of partial-state patches onto `state`, returning the new state without mutating the original.",
    kind: "harness",
    starterCode: "function applyUpdates(state, updates) {\n  // your code here\n}",
    solution: "function applyUpdates(state, updates) {\n  return updates.reduce((acc, patch) => ({ ...acc, ...patch }), state);\n}",
    examples: [{ input: "state { a:1, b:2 }, updates [{ b:3 }, { c:4 }]", output: "result { a:1, b:3, c:4 }, original unchanged", explanation: "Each patch merges immutably; the original object is never modified." }],
    testCases: [
      { description: "merges patches, leaves original", run: "const s = {a:1, b:2}; const result = applyUpdates(s, [{b:3}, {c:4}]); return [result, s];", expected: [{ a: 1, b: 3, c: 4 }, { a: 1, b: 2 }] },
      { description: "later patches win", run: "return applyUpdates({x:1}, [{x:2}, {x:3}]);", expected: { x: 3 } },
      { run: "return applyUpdates({a:1}, []);", expected: { a: 1 }, hidden: true },
    ],
    hints: ["reduce with object spread merges each patch.", "Never assign onto the original state."],
    pitfalls: ["Mutating state with Object.assign(state, patch) changes the caller's object."],
    explanation: "Folding patches with spread produces a new merged object each step, the immutable batched-update pattern.",
    course: SPREAD, resources: r("React: Updating Objects in State", "https://react.dev/learn/updating-objects-in-state"),
  },

  // ===== Derived State =====
  {
    id: "react-derived-007", track: "react", topic: "Derived State", difficulty: "hard",
    title: "Memoized Selector",
    prompt: "Implement `createSelector(fn)` returning a function that caches its last result and only recomputes when called with a different (by reference) argument, like a reselect selector.",
    kind: "harness",
    starterCode: "function createSelector(fn) {\n  // return a memoized selector\n}",
    solution: "function createSelector(fn) {\n  let lastArg;\n  let lastResult;\n  let has = false;\n  return (arg) => {\n    if (!has || arg !== lastArg) {\n      lastArg = arg;\n      lastResult = fn(arg);\n      has = true;\n    }\n    return lastResult;\n  };\n}",
    examples: [{ input: "selector doubles state.value; call with s1, s1, then s2", output: "results [10, 10, 20], fn called 2 times", explanation: "The repeated s1 call hits the cache; only new references recompute." }],
    testCases: [
      { description: "recomputes only on new reference", run: "let calls = 0; const sel = createSelector((s) => { calls++; return s.value * 2; }); const s1 = {value:5}; const a = sel(s1); const b = sel(s1); const s2 = {value:10}; const c = sel(s2); return [a, b, c, calls];", expected: [10, 10, 20, 2] },
      { description: "same reference is cached", run: "let n = 0; const sel = createSelector(() => ++n); const x = {}; sel(x); sel(x); return n;", expected: 1 },
      { run: "let n = 0; const sel = createSelector((a) => { n++; return a; }); sel(1); sel(2); return n;", expected: 2, hidden: true },
    ],
    hints: ["Remember the last argument and result in the closure.", "Recompute only when the new argument differs by reference."],
    pitfalls: ["Deep-comparing arguments defeats the cheap reference check selectors rely on."],
    explanation: "A closure caches the last input and output, recomputing only on a new reference, which is how memoized selectors avoid redundant derived-state work.",
    course: CLO, resources: r("React: Choosing the State Structure", "https://react.dev/learn/choosing-the-state-structure"),
  },

  // ===== Events & Forms =====
  {
    id: "react-forms-007", track: "react", topic: "Events & Forms", difficulty: "medium",
    title: "Form Store",
    prompt: "Build a small form controller.\n\nImplement `FormStore`:\n- `new FormStore(initialValues)`.\n- `setField(name, value)` updates a field.\n- `validate(requiredFields)` sets and returns an errors object mapping each empty required field to `'Required'`.\n- `reset(values)` replaces the values and clears errors.\n- `getValues()` returns the current values.",
    kind: "harness",
    starterCode: "class FormStore {\n  constructor(initialValues) {}\n  setField(name, value) {}\n  validate(requiredFields) {}\n  reset(values) {}\n  getValues() {}\n}",
    solution: "class FormStore {\n  constructor(initialValues) { this.values = { ...initialValues }; this.errors = {}; }\n  setField(name, value) { this.values[name] = value; }\n  validate(requiredFields) {\n    this.errors = {};\n    for (const f of requiredFields) if (!this.values[f]) this.errors[f] = 'Required';\n    return this.errors;\n  }\n  reset(values) { this.values = { ...values }; this.errors = {}; }\n  getValues() { return this.values; }\n}",
    examples: [{ input: "init {name:'',email:''}; setField('name','Ada'); validate(['name','email'])", output: "values {name:'Ada',email:''}, errors {email:'Required'}", explanation: "Only the empty email is flagged required." }],
    testCases: [
      { description: "set a field, then validate", run: "const f = new FormStore({name:'', email:''}); f.setField('name', 'Ada'); const e = f.validate(['name','email']); return [f.getValues(), e];", expected: [{ name: "Ada", email: "" }, { email: "Required" }] },
      { description: "all empty", run: "const f = new FormStore({a:''}); return f.validate(['a']);", expected: { a: "Required" } },
      { run: "const f = new FormStore({name:'x'}); f.reset({name:'y'}); return f.getValues();", expected: { name: "y" }, hidden: true },
    ],
    hints: ["Copy the initial values so the caller's object is not shared.", "validate rebuilds the errors object from scratch."],
    pitfalls: ["Treating 0 or false as missing when some fields may legitimately hold them."],
    explanation: "A small controller holds values and errors, the logic behind a controlled form with validation.",
    course: cr(14, "Object-Oriented Programming (OOP) With JavaScript", 226, "ES6 Classes"),
    resources: r("React: Reacting to Input with State", "https://react.dev/learn/reacting-to-input-with-state"),
  },

  // ===== Rendering Lists =====
  {
    id: "react-render-009", track: "react", topic: "Rendering Lists", difficulty: "medium",
    title: "List Rendering Pipeline",
    prompt: "Implement three cooperating helpers used to render a filtered, sorted, paginated list:\n- `filterItems(items, query)` keeps items whose `name` contains `query` (case-insensitive).\n- `sortItems(items)` returns a new array sorted by `name`.\n- `paginate(items, page, size)` returns the 1-indexed page slice.",
    kind: "harness",
    starterCode: "function filterItems(items, query) {}\n\nfunction sortItems(items) {}\n\nfunction paginate(items, page, size) {}",
    solution: "function filterItems(items, query) {\n  const q = query.toLowerCase();\n  return items.filter((i) => i.name.toLowerCase().includes(q));\n}\n\nfunction sortItems(items) {\n  return [...items].sort((a, b) => a.name.localeCompare(b.name));\n}\n\nfunction paginate(items, page, size) {\n  const start = (page - 1) * size;\n  return items.slice(start, start + size);\n}",
    examples: [{ input: "filter 'a' over [banana, apple, cherry, avocado], sort, paginate(1, 2)", output: "['apple', 'avocado']", explanation: "Filtering to names containing 'a' then sorting and taking page 1 of size 2." }],
    testCases: [
      { description: "filter, sort, paginate", run: "const items = [{name:'banana'},{name:'apple'},{name:'cherry'},{name:'avocado'}]; const f = filterItems(items, 'a'); const s = sortItems(f); const p = paginate(s, 1, 2); return p.map((i) => i.name);", expected: ["apple", "avocado"] },
      { description: "paginate page 2", run: "return paginate([1,2,3,4,5], 2, 2);", expected: [3, 4] },
      { run: "return filterItems([{name:'Xyz'}], 'q').length;", expected: 0, hidden: true },
    ],
    hints: ["Three separate functions compose into the pipeline.", "Sort on a copy so the source is not mutated."],
    pitfalls: ["sort mutates in place; spread first.", "Off-by-one in the page offset (page is 1-indexed)."],
    explanation: "Real list UIs compose filter, sort, and paginate. Keeping them separate, pure functions makes each testable and reusable.",
    course: cr(11, "Working With Arrays", 156, "Data Transformations: map, filter, reduce"),
    resources: r("React: Rendering Lists", "https://react.dev/learn/rendering-lists"),
  },

  // ===== Immutable Arrays =====
  {
    id: "react-imarr-009", track: "react", topic: "Immutable Arrays", difficulty: "medium",
    title: "Array State Reducer",
    prompt: "Implement `arrayReducer(state, action)` for list state:\n- `{ type: 'add', value }` appends.\n- `{ type: 'removeAt', index }` removes by index.\n- `{ type: 'updateAt', index, value }` replaces by index.\n- `{ type: 'move', from, to }` moves an element. All immutable.",
    kind: "harness",
    starterCode: "function arrayReducer(state, action) {\n  // your code here\n}",
    solution: "function arrayReducer(state, action) {\n  switch (action.type) {\n    case 'add': return [...state, action.value];\n    case 'removeAt': return state.filter((_, i) => i !== action.index);\n    case 'updateAt': return state.map((v, i) => (i === action.index ? action.value : v));\n    case 'move': {\n      const copy = [...state];\n      const [m] = copy.splice(action.from, 1);\n      copy.splice(action.to, 0, m);\n      return copy;\n    }\n    default: return state;\n  }\n}",
    examples: [{ input: "add 1, add 2, add 3, updateAt(1,9), move(0,2), removeAt(0)", output: "[3, 1]", explanation: "Becomes [1,9,3] then [9,3,1] after the move, then [3,1] after removing index 0." }],
    testCases: [
      { description: "sequence of array ops", run: "let s = []; s = arrayReducer(s, {type:'add', value:1}); s = arrayReducer(s, {type:'add', value:2}); s = arrayReducer(s, {type:'add', value:3}); s = arrayReducer(s, {type:'updateAt', index:1, value:9}); s = arrayReducer(s, {type:'move', from:0, to:2}); s = arrayReducer(s, {type:'removeAt', index:0}); return s;", expected: [3, 1] },
      { description: "removeAt", run: "return arrayReducer([1,2,3], {type:'removeAt', index:1});", expected: [1, 3] },
      { run: "return arrayReducer([1], {type:'add', value:5});", expected: [1, 5], hidden: true },
    ],
    hints: ["Each action returns a new array via spread, filter, map, or a spliced copy.", "Copy before splicing for the move case."],
    pitfalls: ["Calling splice on the state array directly mutates it."],
    explanation: "A reducer over array actions centralizes immutable list updates, the pattern behind useReducer-managed lists.",
    course: SPREAD, resources: r("React: Updating Arrays in State", "https://react.dev/learn/updating-arrays-in-state"),
  },

  // ===== Props & Classes =====
  {
    id: "react-props-006", track: "react", topic: "Props & Classes", difficulty: "medium",
    title: "Props and className Builder",
    prompt: "Implement two helpers used when rendering a component:\n- `mergeProps(defaults, props)` merges props over defaults (props win).\n- `classNames(map)` returns a space-separated string of the keys whose values are truthy.",
    kind: "harness",
    starterCode: "function mergeProps(defaults, props) {}\n\nfunction classNames(map) {}",
    solution: "function mergeProps(defaults, props) {\n  return { ...defaults, ...props };\n}\n\nfunction classNames(map) {\n  return Object.keys(map).filter((k) => map[k]).join(' ');\n}",
    examples: [{ input: "mergeProps({size:'md',disabled:false},{size:'lg'}); classNames({btn:true, disabled, [size]:true})", output: "props {size:'lg',disabled:false}, class 'btn lg'", explanation: "props override defaults; only truthy class keys are joined." }],
    testCases: [
      { description: "merge props, build class", run: "const props = mergeProps({size:'md', disabled:false}, {size:'lg'}); const cls = classNames({btn:true, disabled:props.disabled, [props.size]:true}); return [props, cls];", expected: [{ size: "lg", disabled: false }, "btn lg"] },
      { description: "classNames filters falsy", run: "return classNames({a:true, b:false, c:1});", expected: "a c" },
      { run: "return mergeProps({a:1}, {a:2, b:3});", expected: { a: 2, b: 3 }, hidden: true },
    ],
    hints: ["Spread defaults then props so props take precedence.", "Filter the class map by truthy values before joining."],
    pitfalls: ["Spreading props before defaults lets defaults override real values.", "Including falsy class keys in the output."],
    explanation: "These two helpers are the everyday glue of component rendering: resolving props with defaults and building conditional class strings.",
    course: SPREAD, resources: r("React: Passing Props to a Component", "https://react.dev/learn/passing-props-to-a-component"),
  },
];
