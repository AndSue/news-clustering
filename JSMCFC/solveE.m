function E = solveE(XX, SS, ISS, H, temp_inv, gamma, V)
B_syl = gamma*SS;
C_syl = gamma*H*ISS;
for v = 1:V
    E{v} = lyap(temp_inv{v},B_syl,-C_syl-XX{v}+XX{v}*H);
end

        