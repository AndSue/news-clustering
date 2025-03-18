function objValue = computeObjValue(X,C,E,L,H,alpha,beta,lambda,gamma,V)

%计算当前迭代目标函数值
obj1 = 0;
obj2 = 0;
obj3 = 0;
obj4 = 0;
for i = 1:V
    Z = H+E{i};
    obj1 = obj1 + norm((X{i}-X{i}*Z),'fro')^2;
    obj2 = obj2 + trace(C*L{i}*C');
    obj3 = obj3 + norm(E{i},'fro')^2;
    obj4 = obj4 + norm((Z-Z*C),'fro')^2;
end
objValue = obj1 + alpha*obj2 + beta*obj3 + gamma*obj4 + lambda*sum(svd(C));