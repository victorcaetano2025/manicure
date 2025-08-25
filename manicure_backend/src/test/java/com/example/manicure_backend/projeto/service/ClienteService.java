package com.example.manicure_backend.projeto.service;

import com.example.manicure_backend.projeto.model.Cliente;
import com.example.manicure_backend.projeto.repository.ClienteRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public Cliente cadastrar(Cliente cliente) {
        // aqui poderia ter validação de email, hash de senha etc.
        return clienteRepository.save(cliente);
    }

    public Optional<Cliente> login(String email, String senha) {
        Optional<Cliente> c = clienteRepository.findByEmail(email);
        if(c.isPresent() && c.get().getSenha().equals(senha)) {
            return c;
        }
        return Optional.empty();
    }
}
