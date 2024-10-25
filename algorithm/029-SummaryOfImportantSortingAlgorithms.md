# 	重要排序算法的总结

排序算法的稳定性是指：同样大小的样本在排序之后不会改变原始的相对次序。稳定性对基础类型对象来说毫无意义；稳定性对非基础类型对象有意义，可以保留之前的相对次序

主要算法时间、空间、稳定性总结
                  			时间               空间              稳定性
SelectionSort    O(N^2)             O(1)               无
BubbleSort       O(N^2)             O(1)               有
InsertionSort    O(N^2)             O(1)               有
MergeSort        O(N\*logN)          O(N)             有
QuickSort        O(N\*logN)        O(logN)          无
HeapSort         O(N*logN)          O(1)               无
CountSort        O(N)               	O(M)               有
RadixSort        O(N)               	O(M)               有

选择、快排、堆排无稳定性（记忆：`快选堆`，快导致不稳定）

注意：随机快速排序的复杂度一定要按照概率上的期望指标来估计，用最差的复杂度估计无意义，随机快排讲解视频里已经有详细的说明

