package com.apsorders.orders.repository;

import com.apsorders.orders.domain.Piece;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class PieceRepositoryWithBagRelationshipsImpl implements PieceRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Piece> fetchBagRelationships(Optional<Piece> piece) {
        return piece.map(this::fetchOrders);
    }

    @Override
    public Page<Piece> fetchBagRelationships(Page<Piece> pieces) {
        return new PageImpl<>(fetchBagRelationships(pieces.getContent()), pieces.getPageable(), pieces.getTotalElements());
    }

    @Override
    public List<Piece> fetchBagRelationships(List<Piece> pieces) {
        return Optional.of(pieces).map(this::fetchOrders).orElse(Collections.emptyList());
    }

    Piece fetchOrders(Piece result) {
        return entityManager
            .createQuery("select piece from Piece piece left join fetch piece.orders where piece is :piece", Piece.class)
            .setParameter("piece", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Piece> fetchOrders(List<Piece> pieces) {
        return entityManager
            .createQuery("select distinct piece from Piece piece left join fetch piece.orders where piece in :pieces", Piece.class)
            .setParameter("pieces", pieces)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
    }
}
