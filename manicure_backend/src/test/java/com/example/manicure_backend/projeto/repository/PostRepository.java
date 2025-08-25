package com.example.manicure_backend.projeto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.manicure_backend.projeto.model.Post;

public interface PostRepository extends JpaRepository<Post, Long> {
}
