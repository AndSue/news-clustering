function [L,G] = constructG(X, knn, numOfView, numOfSample)
%求KNN图的方法
%G:相似性矩阵（KNN矩阵）
%L=W（拉普拉斯矩阵）-D（度矩阵）
addpath(genpath('../MinMaxSelection/'));

G = cell(1,numOfView);
L = cell(1,numOfView);
idx = cell(1,numOfView);
SimMatrix = cell(1,numOfView);
knnGraph = cell(1,numOfView);
ONE = ones(numOfSample);
knn_idx = false(numOfSample);%逻辑0的矩阵
for i = 1:numOfView
    %knn graph
    SimMatrix{i} = make_affinity_matrix(X{i}','euclidean');%相似性矩阵
    [knnGraph{i}, idx{i}] = kNN(SimMatrix{i}, knn);%第i个视图的KNN图
    [~,tp] = extract_from_idx(ONE,idx{i});%根据idx{i}从ONE中提取元素
    %disp(idx{i});
    knn_idx = knn_idx | logical(tp);  %common knn index for all views
end

for i = 1:numOfView
    for j = 1:numOfView
        if j ~= i  %~=:不等于
            [~,tp] = extract_from_idx(SimMatrix{i},idx{j});%根据idx{j}从相似矩阵中提取元素
            knnGraph{i} = knnGraph{i} + (tp + tp')/2;
        end
    end
    G{i} = knnGraph{i};
    L{i} = diag(sum(G{i})) - G{i};%D-W
end
