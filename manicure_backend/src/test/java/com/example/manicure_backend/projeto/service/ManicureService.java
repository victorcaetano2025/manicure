package com.example.manicure_backend.projeto.service;

import com.example.manicure_backend.projeto.model.Manicure;
import com.example.manicure_backend.projeto.repository.ManicureRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class ManicureService {

    private final ManicureRepository manicureRepository;

    public ManicureService(ManicureRepository manicureRepository) {
        this.manicureRepository = manicureRepository;
    }

    public Manicure cadastrar(Manicure manicure) {
        return manicureRepository.save(manicure);
    }

    public Optional<Manicure> login(String email, String senha) {
        Optional<Manicure> m = manicureRepository.findByEmail(email);
        if(m.isPresent() && m.get().getSenha().equals(senha)) {
            return m;
        }
        return Optional.empty();
    }
}
