function [L,G] = constructG(X, knn, numOfView, numOfSample)
%��KNNͼ�ķ���
%G:�����Ծ���KNN����
%L=W��������˹����-D���Ⱦ���
addpath(genpath('../MinMaxSelection/'));

G = cell(1,numOfView);
L = cell(1,numOfView);
idx = cell(1,numOfView);
SimMatrix = cell(1,numOfView);
knnGraph = cell(1,numOfView);
ONE = ones(numOfSample);
knn_idx = false(numOfSample);%�߼�0�ľ���
for i = 1:numOfView
    %knn graph
    SimMatrix{i} = make_affinity_matrix(X{i}','euclidean');%�����Ծ���
    [knnGraph{i}, idx{i}] = kNN(SimMatrix{i}, knn);%��i����ͼ��KNNͼ
    [~,tp] = extract_from_idx(ONE,idx{i});%����idx{i}��ONE����ȡԪ��
    %disp(idx{i});
    knn_idx = knn_idx | logical(tp);  %common knn index for all views
end

for i = 1:numOfView
    for j = 1:numOfView
        if j ~= i  %~=:������
            [~,tp] = extract_from_idx(SimMatrix{i},idx{j});%����idx{j}�����ƾ�������ȡԪ��
            knnGraph{i} = knnGraph{i} + (tp + tp')/2;
        end
    end
    G{i} = knnGraph{i};
    L{i} = diag(sum(G{i})) - G{i};%D-W
end
