# 随机快排

荷兰国旗问题优化后的过程：
在当前范围上选择一个数字x，利用荷兰国旗问题进行数组的划分，<x =x >x
对<x范围重复这个过程，对>x范围重复这个过程

荷兰国旗问题的优化点：选出一个数字x，数组在划分时会搞定所有值是x的数字



快速排序的时间和空间复杂度分析

核心点：怎么选择数字？

选择的数字是当前范围上的固定位置，比如范围上的最右数字，那么就是普通快速排序

选择的数字是当前范围上的随机位置，那么就是随机快速排序

普通快速排序，时间复杂度O(n^2)，额外空间复杂度O(n)

随机快速排序，时间复杂度O(n * logn)，额外空间复杂度O(logn)

关于复杂度的分析，进行定性的说明，定量证明略，因为证明较为复杂

算法导论-7.4.2有详细证明