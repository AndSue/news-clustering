function [A, idx] = kNN(B, knn)
%A：KNN图，idx：索引
[A, idx] = maxk_new(B, knn, 2, 'sorting', false);%按列取最大值，idx为索引，A=B(idx)
n = size(A, 1);   %获取矩阵的行数

%adjacency_matrix = zeros(n,n);
%for i=1:n
%     adjacency_matrix(i, idx(i,:)) = A(i, :);
%end
%A = sparse(adjacency_matrix);

rowidx = ones(knn, n) .* repmat([1:n],knn,1);
A = sparse(rowidx, idx', A', n, n); %'：共轭转置
%S = sparse(i,j,v) 根据 i、j 和 v 三元组生成稀疏矩阵 S，以便 S(i(k),j(k)) = v(k)。max(i)×max(j) 输出矩阵为 length(v) 个非零值元素分配了空间。

% A = max(A, A');
A = (A + A')/2;
% A = power(A .* A', 1/2);
end