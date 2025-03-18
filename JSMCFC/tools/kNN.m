function [A, idx] = kNN(B, knn)
%A��KNNͼ��idx������
[A, idx] = maxk_new(B, knn, 2, 'sorting', false);%����ȡ���ֵ��idxΪ������A=B(idx)
n = size(A, 1);   %��ȡ���������

%adjacency_matrix = zeros(n,n);
%for i=1:n
%     adjacency_matrix(i, idx(i,:)) = A(i, :);
%end
%A = sparse(adjacency_matrix);

rowidx = ones(knn, n) .* repmat([1:n],knn,1);
A = sparse(rowidx, idx', A', n, n); %'������ת��
%S = sparse(i,j,v) ���� i��j �� v ��Ԫ������ϡ����� S���Ա� S(i(k),j(k)) = v(k)��max(i)��max(j) �������Ϊ length(v) ������ֵԪ�ط����˿ռ䡣

% A = max(A, A');
A = (A + A')/2;
% A = power(A .* A', 1/2);
end