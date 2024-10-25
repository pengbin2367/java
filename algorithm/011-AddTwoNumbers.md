# 	[2. 两数相加](https://leetcode.cn/problems/add-two-numbers/)

```java
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        int tmp = l1.val + l2.val;
        boolean flag = false;
        if (tmp >= 10) {
            tmp %= 10;
            flag = true;
        }
        l1 = l1.next; l2 = l2.next;
        ListNode head = new ListNode(tmp);
        ListNode cur = head;
        while (l1 != null || l2 != null) {
            if (l1 == null) tmp = l2.val;
            else if (l2 == null) tmp = l1.val;
            else tmp = l1.val + l2.val;
            if (flag) {
                tmp++;
                flag = false;
            }
            if (tmp >= 10) {
                tmp %= 10;
                flag = true;
            }
            cur.next = new ListNode(tmp);
            cur = cur.next;
            if (l1 != null) l1 = l1.next;
            if (l2 != null) l2 = l2.next;
        }
        if (flag) cur.next = new ListNode(1);
        return head;
    }
}
```

