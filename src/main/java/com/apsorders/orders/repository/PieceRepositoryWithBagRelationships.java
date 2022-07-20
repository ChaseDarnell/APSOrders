package com.apsorders.orders.repository;

import com.apsorders.orders.domain.Piece;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface PieceRepositoryWithBagRelationships {
    Optional<Piece> fetchBagRelationships(Optional<Piece> piece);

    List<Piece> fetchBagRelationships(List<Piece> pieces);

    Page<Piece> fetchBagRelationships(Page<Piece> pieces);
}
