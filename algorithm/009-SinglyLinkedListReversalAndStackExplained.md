# 单双链表及其反转-堆栈诠释

1）按值传递、按引用传递
（我不知道为什么如此多的同学会犯这种错误，这完全是语言问题）

2）单链表、双链表的定义

3）根据反转功能，彻底从系统角度解释链表是如何调整的

[206. 反转链表](https://leetcode.cn/problems/reverse-linked-list/)

```java
class Solution {
    public ListNode reverseList(ListNode head) {
        if (head == null || head.next == null) return head;
        ListNode pre = null;
        ListNode cur = head;
        while (cur != null) {
            ListNode next = cur.next;
            cur.next = pre;
            pre = cur;
            cur = next;
        }
        return pre;
    }
}
```





