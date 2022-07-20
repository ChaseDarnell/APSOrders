package com.apsorders.orders.repository;

import com.apsorders.orders.domain.Piece;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Piece entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PieceRepository extends JpaRepository<Piece, Long> {}
