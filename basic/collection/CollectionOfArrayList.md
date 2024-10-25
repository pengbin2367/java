---
title: 深入Java集合系列之——ArrayList
date: 2021-12-03 19:25:50
tags: [Java, 集合]
---

> ## 6. 总结
>
> 1. ArrayList创建时的大小为0，当加入第一个元素时，进行第一次扩容，默认容量大小为10。（Java8之前为饿汉式，Java8为懒汉式）
> 2. ArrayList每次扩容都以当前数组大小的1.5倍去扩容。
> 3. Vector创建时默认大小为10（饿汉式）。<!-- more -->
> 4. Vector每次扩容都以当前数组大小的2倍去扩容，当指定了capacityIncrement之后，每次扩容仅在原先基础上增加capacityIncrement个单位空间。
> 5. ArrayList和Vector的add、get、size方法的复杂度都为O(1)，remove方法的复杂度为O(n)。
> 6. ArrayList是线程不安全的，Vector是线程安全的。

## 概述

先看源码中的这段注释：

> Resizable-array implementation of the List interface. Implements all optional list operations, and permits all elements, including null. In addition to implementing the List interface, this class provides methods to manipulate the size of the array that is used internally to store the list. (This class is roughly equivalent to Vector, except that it is unsynchronized.)
>
> ......

从这里，我们可以知道，ArrayList是一个动态数组，实现了List接口以及List相关的所有方法，它允许所有元素的插入，包括null。此外，ArrayList和Vector除了线程不同步之外，大致相等。仔细阅读源码中的注释，我们还可以知道：每个ArrayList实例都有一个容量，该容量是指用来存储列表元素的数组的大小。它总是至少等于列表的大小。当元素添加到ArrayList中时，其容量也会自动增长。

## ArrayList的实现

对于ArrayList而言，它实现了List接口、底层使用数组保存所有元素。其操作基本上是对数组的操作。下面我们来分析ArrayList的源代码：

### 底层使用数组实现

```java
/**
 * The array buffer into which the elements of the ArrayList are stored.
 * The capacity of the ArrayList is the length of this array buffer. Any
 * empty ArrayList with elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA
 * will be expanded to DEFAULT_CAPACITY when the first element is added.
 */
transient Object[] elementData; // non-private to simplify nested class access
```

### 属性

```java
// 默认容量大小
private static final int DEFAULT_CAPACITY = 10;
// 空数组常量
private static final Object[] EMPTY_ELEMENTDATA = {};
// 默认的空数组常量
private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};
// 存放元素的数组
transient Object[] elementData; // non-private to simplify nested class access
// 数组中包含的元素个数
private int size;
// 数组的最大上限
private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;
```

ArrayList的属性非常少，就只有这些。其中最重要的莫过于elementData，ArrayList的所有方法都是建立在elementData之上。

### 构造器

ArrayList提供了三种方式的构造器，可以构造一个指定初始容量的空列表和一个默认容量为0的列表(<u>***Java8之前默认容量为10***</u>)以及构造一个包含指定Collection的元素的列表，这些元素按照该Collection的迭代器返回它们的顺序排列的。

```java
public ArrayList(int initialCapacity) {
    if (initialCapacity > 0) {
        this.elementData = new Object[initialCapacity];
    } else if (initialCapacity == 0) {
        this.elementData = EMPTY_ELEMENTDATA;
    } else {
        throw new IllegalArgumentException("Illegal Capacity: "+
                                           initialCapacity);
    }
}

public ArrayList() {
    this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
    // Java8之前为：this(10);
}

public ArrayList(Collection<? extends E> c) {
    Object[] a = c.toArray();
    if ((size = a.length) != 0) {
        if (c.getClass() == ArrayList.class) {
            elementData = a;
        } else {
            elementData = Arrays.copyOf(a, size, Object[].class);
        }
    } else {
        // replace with empty array.
        elementData = EMPTY_ELEMENTDATA;
    }
}
```

### 存储

ArrayList提供了set(int index, E element)、boolean add(E e)、void add(int index, E element)、boolean addAll(Collection<? extends E> c)、boolean addAll(int index, Collection<? extends E> c)这些添加元素的方法。

```java
// 用指定的元素element替代列表中index位置上的元素，并返回以前位于该位置上的元素
public E set(int index, E element) {
    rangeCheck(index);

    E oldValue = elementData(index);
    elementData[index] = element;
    return oldValue;
}
// 将指定的元素e添加到列表尾部
public boolean add(E e) {
    ensureCapacityInternal(size + 1);  // Increments modCount!!
    elementData[size++] = e;
    return true;
}
// 将指定的元素element插入index，如果index有元素，则向右移动当前位于index以及所有后续元素
public void add(int index, E element) {
    rangeCheckForAdd(index);
	// 如果数组长度不足，进行扩容
    ensureCapacityInternal(size + 1);  // Increments modCount!!
    // 将elementData中从index开始，长度为size-index的元素拷贝到从下标为index+1开始的新的elementData数组中
    System.arraycopy(elementData, index, elementData, index + 1,
                     size - index);
    elementData[index] = element;
    size++;
}
// 按照指定Collection的迭代器所返回的元素顺序，将该Collection中的所有元素添加到列表尾部
public boolean addAll(Collection<? extends E> c) {
    Object[] a = c.toArray();
    int numNew = a.length;
    ensureCapacityInternal(size + numNew);  // Increments modCount
    System.arraycopy(a, 0, elementData, size, numNew);
    size += numNew;
    return numNew != 0;
}
// 从指定位置开始，将指定Collection中的所有元素插入到列表中
public boolean addAll(int index, Collection<? extends E> c) {
    rangeCheckForAdd(index);

    Object[] a = c.toArray();
    int numNew = a.length;
    ensureCapacityInternal(size + numNew);  // Increments modCount

    int numMoved = size - index;
    if (numMoved > 0)
        System.arraycopy(elementData, index, elementData, index + numNew,
                         numMoved);

    System.arraycopy(a, 0, elementData, index, numNew);
    size += numNew;
    return numNew != 0;
}

private static int calculateCapacity(Object[] elementData, int minCapacity) {
    if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
        return Math.max(DEFAULT_CAPACITY, minCapacity);
    }
    return minCapacity;
}

private void ensureCapacityInternal(int minCapacity) {
    ensureExplicitCapacity(calculateCapacity(elementData, minCapacity));
}

private void ensureExplicitCapacity(int minCapacity) {
    modCount++;

    // overflow-conscious code
    if (minCapacity - elementData.length > 0)
        grow(minCapacity);
}
```

ArrayList的add方法在插入之前，会先检查是否需要扩容，然后再把元素添加到数组中最后一个元素的后面。在calculateCapacity方法中，我们可以看见，当elementData为空数组时，会使用默认的大小去扩容。所以说，通过无参构造方法来创建ArrayList时，它的大小其实是为0的，只有在使用到的时候，才会通过grow方法去创建一个大小为10的数组。（这与Java8之前不同，Java8之前是属于饿汉式）

第一个add方法的复杂度为O(1)，虽然有时候会涉及到扩容操作，但是扩容的次数是非常少的，所以这一部分时间可以忽略不计。如果使用的是带指定下标的add方法，则复杂度为O(n)，因为涉及到对数组中元素的移动，这一操作是非常耗时的。

### 读取

```java
public E get(int index) {
    rangeCheck(index);

    return elementData(index);
}
```

### 删除

```java
public E remove(int index) {
    rangeCheck(index);

    modCount++;
    E oldValue = elementData(index);

    int numMoved = size - index - 1;
    if (numMoved > 0)
        System.arraycopy(elementData, index+1, elementData, index,
                         numMoved);
    elementData[--size] = null; // clear to let GC do its work

    return oldValue;
}

public boolean remove(Object o) {
    // 由于ArrayList中允许存放null，因此下面通过两种情况来分别处理
    if (o == null) {
        for (int index = 0; index < size; index++)
            if (elementData[index] == null) {
                fastRemove(index);
                return true;
            }
    } else {
        for (int index = 0; index < size; index++)
            if (o.equals(elementData[index])) {
                fastRemove(index);
                return true;
            }
    }
    return false;
}
```

## grow方法

```java
private void grow(int minCapacity) {
    // overflow-conscious code
    int oldCapacity = elementData.length;
    int newCapacity = oldCapacity + (oldCapacity >> 1);
    if (newCapacity - minCapacity < 0)
        newCapacity = minCapacity;
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        newCapacity = hugeCapacity(minCapacity);
    // minCapacity is usually close to size, so this is a win:
    elementData = Arrays.copyOf(elementData, newCapacity);
}
```

grow方法是在数组进行扩容的时候用到的，从中我们可以看见，**<u>ArrayList每次扩容都是扩1.5倍</u>**，然后调用Arrays类的copyOf方法，把元素重新拷贝到一个新的数组中去。这种操作的代价是很高的，因此在实际使用时，我们应该尽量避免数组容量的扩张。当我们可预知要保存的元素的多少时，要在构造ArrayList实例时，就指定其容量，以避免数组扩容的发生，或者根据实际需求，通过调用ensureCapacityInternal方法来手动增加ArrayList实例的容量。

ArrayList还给我们提供了将底层数组的容量调整为当前列表保存的实际元素的大小的功能。它可以通过trimToSize方法来实现。

```java
public void trimToSize() {
    modCount++;
    if (size < elementData.length) {
        elementData = (size == 0)
            ? EMPTY_ELEMENTDATA
            : Arrays.copyOf(elementData, size);
    }
}
```

## Fail-Fast机制

ArrayList也采用了快速失败的机制，通过记录modCount参数来实现。在面对并发的修改时，迭代器很快就会完全失败，而不是冒着在将来某个不确定时间发生任意不确定行为的风险。

## Vector

Vector很多方法都跟ArrayList一样，只是多加了个synchronized来保证线程安全。

Vector比ArrayList多了一个属性：

```java
protected int capacityIncrement;
```

这个属性是在扩容的时候用到的，它表示每次扩容只扩capacityIncrement个空间就足够了。该属性可以通过构造方法给它赋值。

```java
public Vector(int initialCapacity, int capacityIncrement) {
    super();
    if (initialCapacity < 0)
        throw new IllegalArgumentException("Illegal Capacity: "+
                                           initialCapacity);
    this.elementData = new Object[initialCapacity];
    this.capacityIncrement = capacityIncrement;
}

public Vector(int initialCapacity) {    this(initialCapacity, 0);	}

public Vector() {    this(10); 	}
```

从构造方法中，我们可以看出Vector的默认大小也是10，而且它在初始化的时候就已将创建了数组了，这点跟ArrayList不一样，再看一下grow方法：

```java
private void grow(int minCapacity) {
    // overflow-conscious code
    int oldCapacity = elementData.length;
    int newCapacity = oldCapacity + ((capacityIncrement > 0) ?
                                     capacityIncrement : oldCapacity);
    if (newCapacity - minCapacity < 0)
        newCapacity = minCapacity;
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        newCapacity = hugeCapacity(minCapacity);
    elementData = Arrays.copyOf(elementData, newCapacity);
}
```

从grow方法中我们可以发现，newCapacity默认情况下是两倍的oldCapacity，而当指定了capacityIncrement的值之后，newCapacity = oldCapacity + capacityIncrement。



