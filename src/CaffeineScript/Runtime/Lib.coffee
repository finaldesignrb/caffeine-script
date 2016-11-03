module.exports =
  in: (a, b) -> a in b
  mod: (a, b) -> a %% b
  div: (a, b) -> a // b
  pow: (a, b) -> a ** b
  existsOr: (a, b) -> a ? b()

  # CaffeineStyle truth (same as Ruby)

  # returns true if a is anothing other than false, null or undefined
  t: (a) -> a? && a != false

  # returns true if a is false, null or undefined
  f: (a) -> a == false || !a?

  isFunction:       isFunction = (a) -> typeof a is "function"
  isInstance:       isFunction = (a) -> !isFunction(o) and _super.constructor == o.constructor

  ###
  All about getSuper in ES6 land:

    class A {}
    class B extends A {}
    class C extends B {}

    a = new A
    b = new B
    c = new C

    getSuper(B) == A
    getSuper(C) == B

    getSuper(A.prototype) == Object.prototype
    getSuper(B.prototype) == A.prototype
    getSuper(C.prototype) == B.prototype

    getSuper(b) == A.prototype
    getSuper(c) == B.prototype

  prototype map:

  KEY:
    <->
       <-- .constructor
       --> .prototype
    ^  Object.prototypeOf

  MAP:
    A <-> aPrototype

    ^     ^     ^
    |     |     a
    |     |

    B <-> bPrototype

    ^     ^     ^
    |     |     b
    |     |

    C <-> cPrototype

                ^
                c

  Definition of super:

    if instance then prototype's prototype
    else prototype

  ###
  getSuper: getSuper = (o) ->
    _super = Object.getPrototypeOf o
    _super = Object.getPrototypeOf _super if isInstance o
    _super

  ###
  IN:
    klass a new class-function object
    init: (klass) -> outKlass

  OUT: if isFunction outKlass.createWithPostCreate
    outKlass.createWithPostCreate outKlass
  OR
    outKlass (from init)

  EFFECT:
    outKlass.createWithPostCreate?(outKlass) ? outKlass
  ###
  defClass: (klass, init) ->
    outKlass = init.call klass
    outKlass.createWithPostCreate?(outKlass) ? outKlass