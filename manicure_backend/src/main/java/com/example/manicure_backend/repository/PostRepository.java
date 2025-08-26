package com.example.manicure_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.manicure_backend.model.Post;

public interface PostRepository extends JpaRepository<Post, Long> {
}
