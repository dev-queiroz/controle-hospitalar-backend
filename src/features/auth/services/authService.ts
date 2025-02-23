import { supabase } from '../../../config/supabase';
import { Patient } from '../models/patient';

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

// Login ajustado para suportar sus_number ou cpf
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