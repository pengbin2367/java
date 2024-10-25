# [86. 分隔链表](https://leetcode.cn/problems/partition-list/)

```java
class Solution {
    public ListNode partition(ListNode head, int x) {
        if (head == null || head.next == null) return head;
        ListNode small = null, smallHead = small, big = null, bigHead = big;
        if (head.val < x) {
            small = new ListNode(head.val);
            smallHead = small;
            head = head.next;
            while (head != null && head.val < x) {
                small.next = new ListNode(head.val);
                small = small.next;
                head = head.next;
            }
            if (head != null) {
                big = new ListNode(head.val);
                bigHead = big;
                head = head.next;
            }
        } else {
            big = new ListNode(head.val);
            bigHead = big;
            head = head.next;
            while (head != null && head.val >= x) {
                big.next = new ListNode(head.val);
                big = big.next;
                head = head.next;
            }
            if (head != null) {
                small = new ListNode(head.val);
                smallHead = small;
                head = head.next;
            }
        }
        while (head != null) {
            if (head.val < x) {
                small.next = new ListNode(head.val);
                small = small.next;
            } else {
                big.next = new ListNode(head.val);
                big = big.next;
            }
            head = head.next;
        }
        if (small != null) {
            small.next = bigHead;
            return smallHead;
        } else {
            return bigHead;
        }
    }
}
```

