import { supabase } from '../../../config/supabase';
import { Patient } from '../models/patient';
import { Professional } from '../models/professional';

export const registerPatient = async (patientData: Patient) => {
    const { sus_number, rg, cpf, nome, data_nasc, endereco, contato } = patientData;
    if (!sus_number || !cpf || !nome || !data_nasc || !endereco || !contato) {
        throw new Error('Campos obrigatórios: sus_number, cpf, nome, data_nasc, endereco, contato');
    }

    const email = `${sus_number}@hospital.local`;
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password: sus_number });
    if (authError) throw new Error(authError.message);

    const { data, error } = await supabase
        .from('patients')
        .insert({ sus_number, rg, cpf, nome, data_nasc, endereco, contato, user_id: authData.user?.id })
        .select()
        .single();
    if (error) throw new Error(error.message);
    return data;
};

export const registerProfessional = async (professionalData: Professional) => {
    const { nome, crm_coren, especializacao, unidade_saude, cargo } = professionalData;
    if (!nome || !crm_coren || !especializacao || !unidade_saude || !cargo) {
        throw new Error('Campos obrigatórios: nome, crm_coren, especializacao, unidade_saude, cargo');
    }

    const { data, error } = await supabase
        .from('professionals')
        .insert({ nome, crm_coren, especializacao, unidade_saude, cargo })
        .select()
        .single();
    if (error) throw new Error(error.message);
    return data;
};

export const login = async ({ identifier, password }: { identifier: string; password: string }) => {
    const { data: patientBySus, error: susError } = await supabase
        .from('patients')
        .select('sus_number')
        .eq('sus_number', identifier)
        .single();

    const { data: patientByCpf, error: cpfError } = await supabase
        .from('patients')
        .select('sus_number')
        .eq('cpf', identifier)
        .single();

    const sus_number = patientBySus?.sus_number || patientByCpf?.sus_number;
    if (susError && cpfError || !sus_number) throw new Error('Paciente não encontrado');

    const email = `${sus_number}@hospital.local`;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);

    return { user: data.user, token: data.session?.access_token };
};