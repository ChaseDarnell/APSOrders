package com.apsorders.orders.domain;

import com.apsorders.orders.domain.enumeration.StatusP;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Piece.
 */
@Entity
@Table(name = "piece")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Piece implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "serial", nullable = false)
    private String serial;

    @NotNull
    @Column(name = "model", nullable = false)
    private String model;

    @Column(name = "jhi_desc")
    private String desc;

    @NotNull
    @Column(name = "manu", nullable = false)
    private String manu;

    @Column(name = "notes")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_p")
    private StatusP statusP;

    @ManyToMany
    @JoinTable(name = "rel_piece__order", joinColumns = @JoinColumn(name = "piece_id"), inverseJoinColumns = @JoinColumn(name = "order_id"))
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "customer", "pieces" }, allowSetters = true)
    private Set<Order> orders = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Piece id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSerial() {
        return this.serial;
    }

    public Piece serial(String serial) {
        this.setSerial(serial);
        return this;
    }

    public void setSerial(String serial) {
        this.serial = serial;
    }

    public String getModel() {
        return this.model;
    }

    public Piece model(String model) {
        this.setModel(model);
        return this;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getDesc() {
        return this.desc;
    }

    public Piece desc(String desc) {
        this.setDesc(desc);
        return this;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public String getManu() {
        return this.manu;
    }

    public Piece manu(String manu) {
        this.setManu(manu);
        return this;
    }

    public void setManu(String manu) {
        this.manu = manu;
    }

    public String getNotes() {
        return this.notes;
    }

    public Piece notes(String notes) {
        this.setNotes(notes);
        return this;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public StatusP getStatusP() {
        return this.statusP;
    }

    public Piece statusP(StatusP statusP) {
        this.setStatusP(statusP);
        return this;
    }

    public void setStatusP(StatusP statusP) {
        this.statusP = statusP;
    }

    public Set<Order> getOrders() {
        return this.orders;
    }

    public void setOrders(Set<Order> orders) {
        this.orders = orders;
    }

    public Piece orders(Set<Order> orders) {
        this.setOrders(orders);
        return this;
    }

    public Piece addOrder(Order order) {
        this.orders.add(order);
        order.getPieces().add(this);
        return this;
    }

    public Piece removeOrder(Order order) {
        this.orders.remove(order);
        order.getPieces().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Piece)) {
            return false;
        }
        return id != null && id.equals(((Piece) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Piece{" +
            "id=" + getId() +
            ", serial='" + getSerial() + "'" +
            ", model='" + getModel() + "'" +
            ", desc='" + getDesc() + "'" +
            ", manu='" + getManu() + "'" +
            ", notes='" + getNotes() + "'" +
            ", statusP='" + getStatusP() + "'" +
            "}";
    }
}
